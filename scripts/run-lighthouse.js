import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const reportDir = path.join(rootDir, "reports", "lighthouse");
const summaryPath = path.join(reportDir, "latest-summary.md");
const previewPort = 4173;
const previewUrl = `http://127.0.0.1:${previewPort}/`;
const viteCli = path.join(rootDir, "node_modules", "vite", "bin", "vite.js");
const lighthouseCli = path.join(
  rootDir,
  "node_modules",
  "lighthouse",
  "cli",
  "index.js",
);

dotenv.config({ path: path.join(rootDir, ".env") });

const requestedMode = process.argv
  .find((argument) => argument.startsWith("--mode="))
  ?.split("=")[1];
const modes = requestedMode ? [requestedMode] : ["mobile", "desktop"];
const skipBuild = process.argv.includes("--skip-build");

if (modes.some((mode) => !["mobile", "desktop"].includes(mode))) {
  console.error("Invalid --mode. Use --mode=mobile or --mode=desktop.");
  process.exit(1);
}

if (!fs.existsSync(lighthouseCli)) {
  console.error("Lighthouse is not installed. Run: npm install");
  process.exit(1);
}

fs.mkdirSync(reportDir, { recursive: true });

let previewProcess;

const runCommand = (command, args, options = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: rootDir,
      stdio: "inherit",
      ...options,
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${path.basename(command)} exited with code ${code}`));
    });
  });

const waitForPreview = async () => {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(previewUrl);
      if (response.ok) return;
    } catch {
      // Preview is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Preview server did not become ready at ${previewUrl}`);
};

const stopPreview = async () => {
  if (!previewProcess || previewProcess.exitCode !== null) return;
  previewProcess.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => previewProcess.once("close", resolve)),
    new Promise((resolve) => setTimeout(resolve, 2_000)),
  ]);
};

const normalizeReportFiles = (reportBase) => {
  for (const extension of ["html", "json"]) {
    const target = `${reportBase}.${extension}`;
    const generated = [`${reportBase}.report.${extension}`, target].find((candidate) =>
      fs.existsSync(candidate),
    );

    if (!generated) {
      throw new Error(`Expected Lighthouse ${extension.toUpperCase()} report was not created.`);
    }
    if (generated !== target) {
      fs.rmSync(target, { force: true });
      fs.renameSync(generated, target);
    }
  }
};

const runAudit = async (mode) => {
  const reportBase = path.join(reportDir, `latest-${mode}`);
  const args = [
    lighthouseCli,
    previewUrl,
    "--quiet",
    "--only-categories=performance,accessibility,best-practices,seo",
    "--output=html",
    "--output=json",
    `--output-path=${reportBase}`,
    "--chrome-flags=--headless --no-sandbox --disable-gpu",
  ];

  if (mode === "desktop") args.push("--preset=desktop");

  console.log(`Running Lighthouse (${mode})...`);
  await runCommand(process.execPath, args);
  normalizeReportFiles(reportBase);

  const report = JSON.parse(fs.readFileSync(`${reportBase}.json`, "utf8"));
  return { mode, report };
};

const score = (report, category) =>
  Math.round((report.categories[category]?.score ?? 0) * 100);

const cleanDisplayValue = (value) => value?.replaceAll("\u00a0", " ") ?? "n/a";

const metric = (report, auditId) =>
  cleanDisplayValue(report.audits[auditId]?.displayValue);

const topOpportunities = (report) =>
  Object.values(report.audits)
    .filter(
      (audit) =>
        audit.details?.overallSavingsMs > 0 || audit.details?.overallSavingsBytes > 0,
    )
    .sort((left, right) => {
      const leftSaving =
        (left.details?.overallSavingsMs ?? 0) +
        (left.details?.overallSavingsBytes ?? 0) / 1024;
      const rightSaving =
        (right.details?.overallSavingsMs ?? 0) +
        (right.details?.overallSavingsBytes ?? 0) / 1024;
      return rightSaving - leftSaving;
    })
    .slice(0, 5);

const writeSummary = (results) => {
  const generatedAt = new Date().toISOString();
  const lines = [
    "# Latest Lighthouse results",
    "",
    `Generated: ${generatedAt}`,
    "",
    "| Mode | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
  ];

  for (const { mode, report } of results) {
    lines.push(
      `| ${mode} | ${score(report, "performance")} | ${score(report, "accessibility")} | ${score(report, "best-practices")} | ${score(report, "seo")} | ${metric(report, "first-contentful-paint")} | ${metric(report, "largest-contentful-paint")} | ${metric(report, "total-blocking-time")} | ${metric(report, "cumulative-layout-shift")} |`,
    );
  }

  for (const { mode, report } of results) {
    lines.push("", `## ${mode[0].toUpperCase()}${mode.slice(1)}`, "");
    lines.push(`- [Open the full ${mode} HTML report](./latest-${mode}.html)`);
    lines.push(`- JSON: \`latest-${mode}.json\``);
    const opportunities = topOpportunities(report);
    if (opportunities.length) {
      lines.push("- Largest remaining opportunities:");
      for (const audit of opportunities) {
        lines.push(`  - ${audit.title}: ${cleanDisplayValue(audit.displayValue)}`);
      }
    }
  }

  lines.push(
    "",
    "## Re-run",
    "",
    "```bash",
    "npm run lighthouse",
    "```",
    "",
  );
  fs.writeFileSync(summaryPath, lines.join("\n"), "utf8");
};

const main = async () => {
  if (!skipBuild) {
    console.log("Building production bundle...");
    const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
    await runCommand(npmCommand, ["run", "build"], {
      shell: process.platform === "win32",
    });
  }

  console.log(`Starting preview server at ${previewUrl}`);
  previewProcess = spawn(
    process.execPath,
    [viteCli, "preview", "--host", "127.0.0.1", "--port", String(previewPort), "--strictPort"],
    { cwd: rootDir, stdio: "ignore" },
  );
  await waitForPreview();

  const results = [];
  for (const mode of modes) results.push(await runAudit(mode));
  writeSummary(results);

  console.log(`Summary: ${summaryPath}`);
  for (const { mode, report } of results) {
    console.log(
      `${mode}: performance ${score(report, "performance")}, accessibility ${score(report, "accessibility")}, best-practices ${score(report, "best-practices")}, SEO ${score(report, "seo")}`,
    );
  }
};

process.on("SIGINT", async () => {
  await stopPreview();
  process.exit(130);
});

try {
  await main();
  await stopPreview();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  await stopPreview();
  process.exit(1);
}
