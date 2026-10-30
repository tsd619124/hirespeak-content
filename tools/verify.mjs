// Checks what HireSpeak checks before installing: the manifest signature, each pack's SHA-256 and size,
// matching ids and versions, and that no published id disappeared. node tools/verify.mjs
import fs from 'node:fs';
import crypto from 'node:crypto';

const PUBLIC_KEY = 'WD+QanC+q2vbLsV9GTLKnJPBiqis8JLFCMxFJ1RE3E8=';
const spki = Buffer.concat([Buffer.from('302a300506032b6570032100', 'hex'), Buffer.from(PUBLIC_KEY, 'base64')]);
const key = crypto.createPublicKey({ key: spki, format: 'der', type: 'spki' });
const manifestBytes = fs.readFileSync('manifest.json');
const signature = Buffer.from(fs.readFileSync('manifest.json.sig', 'utf8').trim(), 'base64');
let errors = 0;
const fail = message => { errors++; console.error('✗ ' + message); };
if (!crypto.verify(null, manifestBytes, key, signature)) fail('manifest.json 签名无效');
const manifest = JSON.parse(manifestBytes);
const ids = JSON.parse(fs.readFileSync('ids.json', 'utf8'));
for (const entry of manifest.packs) {
  const bytes = fs.readFileSync(entry.file);
  if (crypto.createHash('sha256').update(bytes).digest('hex') !== entry.sha256 || bytes.length !== entry.bytes) fail(`${entry.file} 与清单校验值不符`);
  const pack = JSON.parse(bytes);
  if (pack.id !== entry.id || pack.version !== entry.version || pack.lang !== entry.lang) fail(`${entry.file} 与清单不一致`);
  const kept = new Set([...pack.questions.map(q => q.id), ...pack.phrases.map(p => p.id), ...pack.retired]);
  for (const id of ids[pack.id] || []) if (!kept.has(id)) fail(`${pack.id}: 已发布的 ${id} 被删除`);
}
if (errors) process.exit(1);
console.log(`✓ 签名有效，${manifest.packs.length} 个内容包校验通过`);
