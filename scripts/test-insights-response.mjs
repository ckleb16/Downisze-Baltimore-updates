import assert from 'node:assert/strict';
import { insightsRequest, InsightsApiError, slugifyInsight } from '../client/src/lib/insights.ts';
globalThis.window = { setTimeout, clearTimeout };
let checks = 0;
for(const [type,body,status] of [['text/html','<html>unexpected</html>',200],['application/json','{}',200],['application/json','null',200],['application/json','{invalid',200],['application/json','null',422],['application/json','{"posts":[],"pagination":{"hasMore":true,"nextCursor":null}}',200]]) {
  globalThis.fetch = async () => new Response(body,{status,headers:{'Content-Type':type}});
  await assert.rejects(insightsRequest('/api/posts'), error => error instanceof InsightsApiError && error.status === 502); checks++;
}
globalThis.fetch = async () => Response.json({ posts:[],pagination:{hasMore:false,nextCursor:null}});
assert.deepEqual((await insightsRequest('/api/posts')).posts,[]); checks++;
globalThis.fetch = async () => Response.json({ error: 'A useful error',fields:{title:'Add a title',body:{invalid:true}}},{status:422});
await assert.rejects(insightsRequest('/api/admin/posts'),error=>error.message==='A useful error' && error.fields.title==='Add a title' && !error.fields.body); checks++;
globalThis.window.setTimeout = callback => setTimeout(callback,10);
globalThis.fetch = (_url,{signal}) => new Promise((_resolve,reject)=>signal.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError'))));
await assert.rejects(insightsRequest('/api/posts'),error=>error.status===408); checks++;
assert.equal(slugifyInsight('my-new-'),'my-new'); checks++;
console.log(`Client service-boundary checks passed: ${checks}`);
