/**
 * Smoke test hydration cho site prerender React.
 *
 * Mục tiêu: bắt sớm các lỗi/warning hydration trên route quan trọng bằng cách
 * lắng nghe `console` + `pageerror` trong browser thật (Chromium).
 *
 * Cách chạy:
 *   BASE_URL=https://uat.qiching.org node scripts/smoke-hydration.mjs
 */
import { chromium } from "playwright";

const BASE_URL = (process.env.BASE_URL ?? "https://uat.qiching.org").replace(/\/+$/, "");
const ROUTES = [
  "/",
  "/64-que",
  "/64-que/1-thuan-can",
  "/64-que/46",
  "/tim-ngay-tot",
  "/gioi-thieu",
  "/que-da-luu",
  "/abc-rac",
];

const HYDRATION_PATTERNS = [
  /hydration/i,
  /did not match/i,
  /text content does not match/i,
  /while hydrating/i,
  /server rendered html/i,
  /minified react error #418/i,
  /minified react error #423/i,
];

const MAX_REDIRECT_HOPS = 5;

function collectRedirectChain(response) {
  if (!response) return [];
  const chain = [];
  let req = response.request();
  while (req) {
    const res = req.response();
    const status = res ? (typeof res.status === "function" ? res.status() : res.status) : null;
    chain.push({
      url: req.url(),
      method: req.method(),
      status,
    });
    req = req.redirectedFrom();
  }
  chain.reverse();
  return chain;
}

function checkRedirectChain(baseUrl, route, chain) {
  const issues = [];
  if (chain.length === 0) return issues;

  if (chain.length > MAX_REDIRECT_HOPS + 1) {
    issues.push({
      type: "redirect",
      level: "error",
      text: `Redirect chain quá dài (${chain.length - 1} hop), vượt ngưỡng ${MAX_REDIRECT_HOPS}`,
    });
  }

  const base = new URL(baseUrl);
  const expectedFinal = `${baseUrl}${route}`;
  for (const hop of chain) {
    let parsed;
    try {
      parsed = new URL(hop.url);
    } catch {
      issues.push({ type: "redirect", level: "error", text: `URL redirect không hợp lệ: ${hop.url}` });
      continue;
    }
    if (parsed.protocol !== base.protocol) {
      issues.push({
        type: "redirect",
        level: "error",
        text: `Sai protocol trong chain: ${hop.url} (mong đợi ${base.protocol})`,
      });
    }
  }

  const first = chain[0]?.url;
  const last = chain[chain.length - 1]?.url;
  if (first && first !== expectedFinal) {
    issues.push({
      type: "redirect",
      level: "warn",
      text: `Request đầu chain khác URL kỳ vọng: ${first} (expected ${expectedFinal})`,
    });
  }
  if (last) {
    let parsedLast;
    try {
      parsedLast = new URL(last);
      if (parsedLast.host !== base.host) {
        issues.push({
          type: "redirect",
          level: "error",
          text: `Final URL lệch host: ${last} (expected host ${base.host})`,
        });
      }
    } catch {
      issues.push({ type: "redirect", level: "error", text: `Final URL không hợp lệ: ${last}` });
    }
  }

  return issues;
}

function formatChain(chain) {
  if (chain.length <= 1) return "none";
  return chain.map((h) => `${h.status ?? "?"}:${h.url}`).join(" -> ");
}

function isHydrationIssue(text) {
  return HYDRATION_PATTERNS.some((re) => re.test(text));
}

async function checkRoute(context, route) {
  const page = await context.newPage();
  const url = `${BASE_URL}${route}`;
  const issues = [];

  page.on("console", (msg) => {
    const text = msg.text();
    if (isHydrationIssue(text)) {
      issues.push({ type: "console", level: msg.type(), text });
    }
  });

  page.on("pageerror", (err) => {
    const text = String(err?.message ?? err);
    if (isHydrationIssue(text)) {
      issues.push({ type: "pageerror", level: "error", text });
    }
  });

  let httpStatus = "n/a";
  let redirectChain = [];
  try {
    const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
    if (response) {
      httpStatus = String(response.status());
      redirectChain = collectRedirectChain(response);
      issues.push(...checkRedirectChain(BASE_URL, route, redirectChain));
    }
    await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => undefined);
    await page.waitForTimeout(600);
  } catch (err) {
    issues.push({ type: "navigation", level: "error", text: String(err) });
  }

  await page.close();
  return { route, url, httpStatus, redirectChain, issues };
}

async function main() {
  console.log(`Hydration smoke test on ${BASE_URL}`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  const results = [];
  for (const route of ROUTES) {
    const result = await checkRoute(context, route);
    results.push(result);
    console.log(
      `- ${route} -> HTTP ${result.httpStatus}, redirects: ${Math.max(0, result.redirectChain.length - 1)}, issues: ${result.issues.length}`,
    );
    if (result.redirectChain.length > 1) {
      console.log(`  chain: ${formatChain(result.redirectChain)}`);
    }
  }

  await context.close();
  await browser.close();

  const failed = results.filter((r) => r.issues.some((i) => i.level === "error"));
  const warned = results.filter((r) => r.issues.some((i) => i.level === "warn"));
  if (failed.length === 0) {
    console.log("\nPASS: No hydration issues detected on all smoke routes.");
    if (warned.length > 0) {
      console.log(`WARN: Có ${warned.length} route có cảnh báo redirect chain (không fail).`);
      for (const r of warned) {
        console.log(`  - ${r.route}`);
      }
    }
    return;
  }

  console.error(`\nFAIL: Found hydration-related issues on ${failed.length} route(s).`);
  for (const r of failed) {
    console.error(`\n[${r.route}] ${r.url}`);
    for (const issue of r.issues) {
      console.error(`  - (${issue.type}/${issue.level}) ${issue.text}`);
    }
  }
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
