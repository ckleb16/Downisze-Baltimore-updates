import { randomBytes, scrypt } from "node:crypto";

// Read the password from stdin so it never appears in command arguments or source.
process.stdout.write("Ready for password JSON on stdin (input is hidden).\n");
const input = await new Promise((resolve, reject) => {
  let buffer = "";
  process.stdin.setEncoding("utf8");
  if (process.stdin.isTTY) process.stdin.setRawMode(true);
  process.stdin.on("data", function receive(chunk) {
    buffer += chunk;
    if (buffer.includes("\u0003") || buffer.length > 4096) reject(new Error("Password input cancelled."));
    if (!/[\r\n]/.test(buffer)) return;
    process.stdin.removeListener("data", receive);
    if (process.stdin.isTTY) process.stdin.setRawMode(false);
    process.stdin.pause();
    resolve(buffer.split(/[\r\n]/)[0]);
  });
});
const { password } = JSON.parse(input);
if (typeof password !== "string" || password.length < 12 || password.length > 256) {
  throw new Error("Use a password between 12 and 256 characters.");
}
const salt = randomBytes(16);
const key = await new Promise((resolve, reject) => {
  scrypt(password, salt, 32, { N: 16384, r: 8, p: 5, maxmem: 32 * 1024 * 1024 }, (error, derived) => {
    if (error) reject(error);
    else resolve(derived);
  });
});
process.stdout.write(JSON.stringify({ hash: `scrypt$16384$8$5$${salt.toString("hex")}$${key.toString("hex")}` }));
