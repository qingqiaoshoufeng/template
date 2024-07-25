import fs from "fs";
import glob from "fast-glob";
import { loadEnv } from "vite";
export const setGenerateTimeInGlobalVariable = (deployTime) => ({
  name: "window-global-variable",
  transformIndexHtml(html) {
    // 添加脚本到HTML中以设置全局变量
    const script = `window.CASTLE__deployTime = ${deployTime};`;
    return html.replace("</head>", `<script>${script}</script></head>`);
  },
});

const lowcodePath = "./public/lowcode";
export const castleLowcodeBuildSaveSchema = (mode) => ({
  name: "castle-lowcode-build-save-schema",
  async buildStart() {
    const env = loadEnv(mode, process.cwd(), "");
    const { isMainappMode: isMainapp } = env;
    const isMainappMode = isMainapp === "true";
    if (mode === "development" || !isMainappMode) {
      return;
    }

    console.log("[🏰 CASTLE CLI] ⌛️ 开始处理低代码 Schema ...");
    const results = [];
    async function scan() {
      const files = await glob(["src/**/*.{vue,js,ts,jsx,tsx}"]);
      for (const file of files) {
        const content = fs.readFileSync(file, "utf-8");

        const regex = /<LowCodeRender[^>]*\/>/gim;
        const match = content.match(regex);

        if (match) {
          results.push({
            filePath: file,
            code: match,
            pageIdAndVersions: match.map(
              (i) => `${i.match(/(pageId|page-id)="([^"]*)"/)[2]},${i.match(/version="([^"]*)"/)[1]}`,
            ),
          });
        }
      }

      if (!fs.existsSync(lowcodePath)) {
        fs.mkdirSync(lowcodePath, { recursive: true });
      }

      fs.writeFileSync(
        "./public/lowcode/castle-lowcode-page-id-result.json",
        JSON.stringify(results, null, 2),
        { encoding: "utf8" },
        (err) => {
          if (err) {
            throw err;
          }
        },
      );
    }

    await scan();

    const allPageIdAndVersions = [];
    results.forEach((i) => {
      allPageIdAndVersions.push(...i.pageIdAndVersions);
    });
    const uniqAllPageIdAndVersions = [...new Set(allPageIdAndVersions)];

    function chunkArray(array, size) {
      let result = [];
      for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
      }
      return result;
    }

    const chunkedAllPageIdAndVersions = chunkArray(uniqAllPageIdAndVersions, 6);
    const allPageSchema = [];
    for (const arr of chunkedAllPageIdAndVersions) {
      await Promise.all(
        arr.map(async (pageIdAndVersion) => {
          const [pageId, version] = pageIdAndVersion.split(",");
          return fetch(`http://10.13.4.153:3001/api/lowcode/page/schema?pageId=${pageId}&version=${version}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.code !== 200) {
                throw new Error();
              } else {
                return data;
              }
            })
            .catch(() =>
              console.error(
                `[🏰 CASTLE CLI] ❌ PageId: ${pageId} , Version: ${version} 获取失败！完整请求：http://10.13.4.153:3001/api/lowcode/page/schema?pageId=${pageId}&version=${version}`,
              ),
            );
        }),
      )
        .then((res) => {
          allPageSchema.push(...res.map((i) => i.data));
        })
        .catch(() => {
          // process.exit(1);
          throw new Error("请求接口失败");
        });
    }

    allPageSchema.forEach((i) => {
      fs.writeFileSync(`./public/lowcode/${i.pageId}.json`, JSON.stringify(i, null, 2), { encoding: "utf8" }, (err) => {
        if (err) {
          throw err;
        }
      });
    });

    console.log("[🏰 CASTLE CLI] ✅ 低代码 Schema 处理完成!");
  },
  async closeBundle() {
    await fs.rmSync(lowcodePath, { recursive: true, force: true });
  },
});
