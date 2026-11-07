# 🧙 概述

**AI 占卜：** 完成求签、起卦、抽牌等仪式后，系统按结果查出原典资料，再由 AI 结合用户的问题解读。

| 页面      | 内容                                                  | 依据资料                                      |
| --------- | ----------------------------------------------------- | --------------------------------------------- |
| `/`       | 观音灵签：摇签后掷筊，得圣杯定签                      | 艋舺龙山寺版观音一百签                        |
| `/zhouyi` | 周易算卦：六次三钱卜筮，按朱熹《易学启蒙》占法取辞    | 六十四卦卦辞、爻辞、白话解释与传统解卦        |
| `/tarot`  | 塔罗占卜：过去、现在、未来三张牌阵                    | Waite《The Pictorial Key to the Tarot》原文   |
| `/dream`  | 周公解梦：按关键词匹配梦象                            | 敦煌写本《新集周公解梦书》                    |
| `/admin`  | 占卜记录后台（需设置 `ADMIN_PASSWORD`，用户名 admin） |                                               |

AI 解读按 IP 限流，每小时最多 20 次；计数保存在进程内存中，多实例部署时各实例分别计数。

## ⚙️ 设置

#### 环境变量

- `OPENAI_API_KEY`：模型接口密钥
- `OPENAI_BASE_URL`：自定义 API 接口地址，默认：`https://api.openai.com/v1`
- `OPENAI_MODEL`：自定义 OpenAI 模型，默认：`gpt-3.5-turbo`
- `DATABASE_URL`：可选，Neon Postgres 连接串，用于记录占卜日志（保留 90 天）
- `IP_HASH_SALT`：可选，访客 IP 哈希的盐，不设置则不记录访客标识
- `ADMIN_PASSWORD`：可选，`/admin` 后台密码，不设置则后台不可访问

#### 周易资料

卦文源文件是 `lib/data/zhouyi/*.md`，服务端使用的是由它生成的 `lib/data/zhouyi.json`。修改卦文后运行 `pnpm zhouyi` 重新生成；任何一卦缺少所需段落时脚本会报错。

## 🚀 本地运行

1. 克隆仓库：

```sh
git clone https://github.com/sunls24/divination
```

2. 安装依赖项：

```bash
pnpm install
```

3. 本地运行：

```bash
# 设置环境变量 OPENAI_API_KEY=sk-xxx
touch .env.local
# 本地运行
pnpm run dev
```

## ☁️ 使用 Vercel 部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsunls24%2Fdivination&env=OPENAI_API_KEY)

---

![screenshots](./docs/screenshots.jpg)
