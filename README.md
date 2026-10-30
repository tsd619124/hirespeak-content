# HireSpeak 题库内容

HireSpeak（面试训练应用，1.31 起）从这里下载题库增补内容。应用只请求这些公开的静态文件，不上传任何用户数据。

## 文件

| 文件 | 说明 |
|---|---|
| `manifest.json` | 内容清单：每个内容包的版本、最低应用版本、文件、SHA-256 和大小 |
| `manifest.json.sig` | 清单的 Ed25519 签名（base64）。应用内置公钥，签名不符不会安装 |
| `packs/<id>.json` | 内容包（格式 `hirespeak-pack-1`），按语言和主题划分，单个不超过 300 KB |
| `ids.json` | 每个内容包发布过的全部条目 id，用于防止误删 |

应用默认先从 `raw.githubusercontent.com` 获取，失败时改用 jsDelivr 镜像（`cdn.jsdelivr.net/gh/tsd619124/hirespeak-content@main/`）。

## 规则

- **已发布的 id 永不删除、永不复用。** 不再使用的题目移到 `retired` 列表：它不再出现在新练习里，但用户的练习记录和复习卡仍然有效。
- 修改题目内容时，内容包的 `version` 必须更新；题目可加 `rev` 字段标记修订次数。
- 中文题 id 以 `zh-x-` 开头，英文题以 `x-` 开头；句型以 `ph-zh-x-` / `ph-x-` 开头，不与内置题库重名。
- 示范回答里的公司和人物都是虚构的。

## 发布流程

1. 编辑 `packs/*.json`，提升 `version`。
2. 在应用仓库里运行 `node tools/content-build.mjs <本仓库目录>`：按应用的规则校验全部内容、更新 `ids.json`，重写并签名 `manifest.json`（签名私钥不在任何仓库里）。
3. 运行 `node tools/verify.mjs` 自检，提交并推送。推送即对所有 1.31 及以上版本的用户可见。
