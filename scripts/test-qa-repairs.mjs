import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { scryptSync, randomBytes } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import worker from '../server/worker.ts';

// All writing is isolated in memory. Never touches live articles, credentials, or uploads.
const sqlite = new DatabaseSync(':memory:');
for (const name of readdirSync('drizzle').filter(n => n.endsWith('.sql')).sort()) sqlite.exec(readFileSync(`drizzle/${name}`, 'utf8'));
class Statement {
  constructor(sql, values=[]) { this.sql=sql; this.values=values; }
  bind(...values) { return new Statement(this.sql, values); }
  async first() { return sqlite.prepare(this.sql).get(...this.values) ?? null; }
  async all() { return {success:true,results:sqlite.prepare(this.sql).all(...this.values),meta:{}}; }
  async run() { return {success:true,results:[],meta:{changes:Number(sqlite.prepare(this.sql).run(...this.values).changes)}}; }
}
const DB = {prepare: sql => new Statement(sql), async batch(statements) {
  sqlite.exec('BEGIN');
  try { const result=[]; for(const s of statements) result.push(await (/RETURNING|^\s*SELECT|^\s*PRAGMA/i.test(s.sql) ? s.all():s.run())); sqlite.exec('COMMIT'); return result; }
  catch(error) { sqlite.exec('ROLLBACK'); throw error; }
}};
const images = new Map();
const MEDIA = {async put(key, bytes, options) { images.set(key,{bytes,options}); }, async get(key) { const image=images.get(key); return image ? { body:image.bytes,httpEtag:'"test-image"'} : null; }, async delete(key) { images.delete(key); }};
const salt=randomBytes(16); const password='isolated-regression-password';
const hash=scryptSync(password,salt,32,{N:16384,r:8,p:5,maxmem:32*1024*1024});
const video=readFileSync('client/public/manus-storage/pop-with-music-20261007.mp4');
assert.equal(video.length,9001545);
const env={DB,MEDIA,BLOG_LOGIN_USERNAME:'qa@example.test',BLOG_LOGIN_PASSWORD_HASH:`scrypt$16384$8$5$${salt.toString('hex')}$${hash.toString('hex')}`,SITE_URL:'https://qa.example.test',SITE_INDEXABLE:'true',ASSETS:{async fetch(request) {
  if(new URL(request.url).pathname.endsWith('.mp4')) return new Response(video,{headers:{'Content-Type':'video/mp4'}});
  return new Response(readFileSync('client/index.html'),{headers:{'Content-Type':'text/html'}});
}}};
const origin='https://qa.example.test';
const call=(path,options={})=>worker.fetch(new Request(origin+path,options),env);
const write=(body,method='POST')=>({method,headers:{'Content-Type':'application/json',Origin:origin,'X-Downsize-Publisher':'1',Cookie:cookie},...(body===undefined?{}:{body:JSON.stringify(body)})});
let cookie=''; let checks=0;
const equal=(actual,expected,message)=>{assert.equal(actual,expected,message);checks++;};
const login=await call('/api/admin/login',write({username:env.BLOG_LOGIN_USERNAME,password}));
cookie=login.headers.get('Set-Cookie').split(';')[0];
equal(login.status,200,'Isolated sign-in works');
for(const invalid of [null,[],7,'']) equal((await call('/api/admin/posts',write(invalid))).status,422,'Malformed input is controlled');
const base={title:'Multigenerational Living: A Guide for Baltimore Families',slug:'original-address',excerpt:'A test summary.',body:'A disposable article.',status:'published',publishedAt:'2026-08-01T12:00:00.000Z'};
let created=await call('/api/admin/posts',write(base)); equal(created.status,201,'Create');
let post=(await created.json()).post;
const updated=await call(`/api/admin/posts/${post.id}`,write({...base,slug:'new-address',version:post.version},'PUT'));
equal(updated.status,200,'Rename'); post=(await updated.json()).post;
equal((await call('/insights-advice/original-address')).status,308,'Old public address redirects');
equal((await call('/api/posts/original-address')).status,200,'Old API address resolves');
equal((await call('/api/admin/posts',write({...base,slug:'original-address'}))).status,409,'Old address stays reserved');
const histories=await (await call(`/api/admin/posts/${post.id}/revisions`,{headers:{Cookie:cookie}})).json();
equal(histories.revisions.length,1,'Previous version retained');
equal(histories.revisions[0].post.slug,'original-address','Snapshot is prior article');
equal((await call(`/api/admin/posts/${post.id}`,write({...base,version:1},'PUT'))).status,409,'Stale write rejected');
equal((await call(`/api/admin/posts/${post.id}`,write(undefined,'DELETE'))).status,200,'Soft delete');
equal((await call('/api/posts/original-address')).status,404,'Old address private while trashed');
equal((await call(`/api/admin/posts/${post.id}/restore`,write())).status,200,'Restore works');
equal((await call('/api/posts/new-address')).status,404,'Restore stays a draft');
const future=await call('/api/admin/posts',write({...base,slug:'future',publishedAt:'2099-01-01T12:00:00.000Z'})); equal(future.status,201,'Future post can be scheduled');
equal((await call('/api/posts/future')).status,404,'Scheduled article not visible early');
assert(!(await (await call('/sitemap.xml')).text()).includes('/future')); checks++;
for(let i=0;i<25;i++) equal((await call('/api/admin/posts',write({...base,slug:`paging-${i}`,publishedAt:new Date(Date.UTC(2026,7,2+i)).toISOString()}))).status,201,'Pagination fixture');
const first=await (await call('/api/posts?limit=20')).json(); equal(first.posts.length,20,'First page count');
const before=await (await call(`/api/posts?limit=20&cursor=${first.pagination.nextCursor}`)).json();
await call(`/api/admin/posts/${first.posts[0].id}`,write(undefined,'DELETE'));
const after=await (await call(`/api/posts?limit=20&cursor=${first.pagination.nextCursor}`)).json();
assert.deepEqual(after.posts.map(p=>p.id),before.posts.map(p=>p.id)); checks++;
equal((await call('/api/posts?cursor=bad!')).status,422,'Invalid cursor controlled');
const device=crypto.randomUUID(); const snapshot={form:{body:'unfinished text'},savedForm:{body:''}};
equal((await call(`/api/admin/recovery/${device}`,write({snapshot,writtenAt:Date.now()},'PUT'))).status,200,'Recovery autosave');
equal((await (await call(`/api/admin/recovery/${device}`,{headers:{Cookie:cookie}})).json()).recovery.form.body,'unfinished text','Recovery survives separate request');
equal((await call(`/api/admin/recovery/${device}`)).status,401,'Recovery private');
const imageForm=new FormData(); imageForm.set('image',new File([readFileSync('client/public/media-thumbnails/pbs-empowering-seniors.jpg')],'test.jpg',{type:'image/jpeg'}));
const upload=await call('/api/admin/images',{method:'POST',headers:{Origin:origin,'X-Downsize-Publisher':'1',Cookie:cookie},body:imageForm});
equal(upload.status,201,'Image upload'); const imageUrl=(await upload.json()).url;
equal((await call(imageUrl)).status,404,'Draft image private');
equal((await call(imageUrl,{headers:{Cookie:cookie}})).status,200,'Publisher can preview draft image');
equal((await call('/api/admin/posts',write({...base,slug:'with-image',body:`![A descriptive caption](${imageUrl})`}))).status,201,'Publish image article');
equal((await call(imageUrl)).status,200,'Published image public');
const svg=new FormData(); svg.set('image',new File(['<svg onload="alert(1)"></svg>'],'unsafe.svg',{type:'image/svg+xml'}));
equal((await call('/api/admin/images',{method:'POST',headers:{Origin:origin,'X-Downsize-Publisher':'1',Cookie:cookie},body:svg})).status,422,'SVG rejected');
for(const [range,start,end] of [['bytes=0-1023',0,1023],['bytes=100-',100,video.length-1],['bytes=-512',video.length-512,video.length-1]]) {
  const response=await call('/media/pop-family-video.mp4',{headers:{Range:range}}); equal(response.status,206,'Video range works');
  equal(response.headers.get('Content-Range'),`bytes ${start}-${end}/${video.length}`,'Content range correct');
  assert.deepEqual(Buffer.from(await response.arrayBuffer()),video.subarray(start,end+1)); checks++;
}
equal((await call('/media/pop-family-video.mp4',{headers:{Range:'bytes=99999999-'}})).status,416,'Unsatisfiable range');
equal((await call('/media/pop-family-video.mp4',{method:'HEAD'})).headers.get('Content-Length'),String(video.length),'Video HEAD length');
equal((await call('/publisher')).headers.get('Cache-Control'),'private, no-store','Publisher stays private');
assert((await (await call('/publisher')).text()).includes('noindex,nofollow')); checks++;
assert((await (await call('/')).text()).includes('index,follow')); checks++;
sqlite.close(); console.log(`QA repair regression checks passed: ${checks}`);
