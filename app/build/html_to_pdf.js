const { chromium } = require("playwright");
(async () => {
  const [src, out] = process.argv.slice(2);
  const b = await chromium.launch(), p = await b.newPage();
  await p.goto("file://" + src);
  await p.pdf({ path: out, format: "A4", margin: { top: "16mm", bottom: "18mm", left: "15mm", right: "15mm" }, displayHeaderFooter: true,
    headerTemplate: "<span></span>", footerTemplate: '<div style="font-size:8px;width:100%;text-align:center">page <span class="pageNumber"></span> of <span class="totalPages"></span></div>' });
  await b.close();
})();
