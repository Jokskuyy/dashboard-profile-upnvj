import { spawn, execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const reportBase = path.join(rootDir, "lighthouse-report");

// Load environment variables from .env file
dotenv.config({ path: path.join(rootDir, ".env") });

console.log("🚀 Starting automated Lighthouse audit...");

// 1. Build the production site
console.log("📦 Building production bundle (npm run build)...");
try {
  execSync("npm run build", { cwd: rootDir, stdio: "inherit" });
  console.log("✅ Production build succeeded.");
} catch (error) {
  console.error("❌ Build failed:", error.message);
  process.exit(1);
}

// 2. Start the Vite preview server in the background
console.log("🌐 Starting Vite preview server...");
const previewPort = 4173;
const previewProcess = spawn("npx", ["vite", "preview", "--port", String(previewPort)], {
  cwd: rootDir,
  shell: true,
});

let serverStarted = false;

// Helper to kill server and exit
const cleanupAndExit = (code = 0) => {
  console.log("🧹 Stopping preview server...");
  previewProcess.kill("SIGTERM");
  process.exit(code);
};

// Monitor server output to wait for it to be ready
previewProcess.stdout.on("data", (data) => {
  const output = data.toString();
  console.log(`[Vite Preview] ${output.trim()}`);
  
  if (output.includes("http://localhost:") && !serverStarted) {
    serverStarted = true;
    runLighthouse();
  }
});

previewProcess.stderr.on("data", (data) => {
  console.error(`[Vite Preview Error] ${data}`);
});

previewProcess.on("close", (code) => {
  if (!serverStarted) {
    console.error(`❌ Preview server closed prematurely with code ${code}`);
    process.exit(1);
  }
});

// Set a timeout of 10s to start server in case stdout match is missed
setTimeout(() => {
  if (!serverStarted) {
    console.log("⚠️ Preview server startup log not captured, proceeding with Lighthouse run anyway...");
    serverStarted = true;
    runLighthouse();
  }
}, 6000);

// 3. Run Lighthouse CLI
function runLighthouse() {
  console.log(`🔍 Running Lighthouse audit against http://localhost:${previewPort}...`);
  
  // Create output dir if needed
  const reportDir = path.dirname(reportBase);
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  // Define outputs
  const htmlPath = `${reportBase}.html`;
  const jsonPath = `${reportBase}.json`;

  // Use npx lighthouse to run the audit
  const lhci = spawn("npx", [
    "lighthouse",
    `http://localhost:${previewPort}`,
    "--output", "html",
    "--output", "json",
    "--output-path", reportBase,
    "--chrome-flags=--headless --no-sandbox --disable-gpu",
  ], {
    cwd: rootDir,
    shell: true,
  });

  lhci.stdout.on("data", (data) => {
    console.log(`[Lighthouse Stdout] ${data.toString().trim()}`);
  });

  lhci.stderr.on("data", (data) => {
    console.error(`[Lighthouse Stderr] ${data.toString().trim()}`);
  });

  lhci.on("close", (code) => {
    if (code !== 0) {
      console.error(`❌ Lighthouse exited with code ${code}`);
      cleanupAndExit(1);
      return;
    }

    console.log("✅ Lighthouse audit completed.");
    
    // 4. Parse scores from JSON report
    try {
      const resolvedHtmlPath = fs.existsSync(`${reportBase}.report.html`) ? `${reportBase}.report.html` : htmlPath;
      const resolvedJsonPath = fs.existsSync(`${reportBase}.report.json`) ? `${reportBase}.report.json` : jsonPath;

      if (fs.existsSync(resolvedJsonPath)) {
        const rawJson = fs.readFileSync(resolvedJsonPath, "utf8");
        const report = JSON.parse(rawJson);
        
        const categories = report.categories || {};
        const perf = Math.round((categories.performance?.score || 0) * 100);
        const a11y = Math.round((categories.accessibility?.score || 0) * 100);
        const bp = Math.round((categories["best-practices"]?.score || 0) * 100);
        const seo = Math.round((categories.seo?.score || 0) * 100);
        
        console.log("\n📊 ==================================");
        console.log("📊     LIGHTHOUSE AUDIT SCORES     ");
        console.log("📊 ==================================");
        console.log(`📊 Performance:      ${perf}/100`);
        console.log(`📊 Accessibility:    ${a11y}/100`);
        console.log(`📊 Best Practices:  ${bp}/100`);
        console.log(`📊 SEO:             ${seo}/100`);
        console.log("📊 ==================================\n");
        console.log(`📁 Report HTML saved to: ${resolvedHtmlPath}`);
        console.log(`📁 Report JSON saved to: ${resolvedJsonPath}`);
      } else {
        console.error("❌ Lighthouse JSON report file not found at:", resolvedJsonPath);
      }
    } catch (err) {
      console.error("❌ Failed to parse Lighthouse report json:", err.message);
    }
    
    cleanupAndExit(0);
  });
}
