# Website Ops Q&A Smoke Tests

This smoke suite checks whether the Website Ops system still answers the basic operational questions we care about.

Run from the `AIM Website` folder:

```bash
node website-ops/ops-system-smoke-tests.mjs
```

The script prints JSON and exits with a non-zero code if any required check fails.

## Questions Covered

- Does the latest QA report actually contain known staging failures?
- Does QA include agent-readability findings such as missing Markdown alternates, `llms.txt`, JSON-LD, canonical links, or semantic structure?
- Is the large blank screenshot band detector wired, including scroll-settle retry evidence?
- Does `website-ops/product-rules.json` still contain the current payment discount stacking rule?
- Does `website-ops/product-rules.json` still contain the case source-fidelity rule for YouTube screenshots, technology evidence, reviewer checks, and the standalone reviewer prompt path?
- Does the Website Hub summary regenerate from `product-rules.json`?
- Do Surikat docs point to the same product-rule registry before answering payment-rule questions?
- Does Surikat's local routing self-test still pass for payment screenshots, GitHub draft links, and staging links?
- Does the payment popup implementation still match the documented discount rule?
- Are update cadences for QA, DeviceCloud, Surikat, product-rule sync, case source-fidelity review, and hub refresh still documented in JSON and visible in the hub?
- Are the local preview links for key docs reachable?

## Current Expected Result

The suite should pass while the local preview server is running on port `5123`.

If the preview server is not running, the local-link check is skipped rather than failed. The rest of the checks still run from local files.

## What This Does Not Prove Yet

- It does not run a full live production/staging crawl; that remains the job of `AIM Site Agent Evaluation`.
- It does not open paid device-cloud sessions.
- It does not prove that every future product rule was correctly inferred from source. It proves the registry, hub sync, Surikat docs, and implementation-drift checks are connected for the currently documented rules.
- It does not send Telegram messages or create Linear issues; Surikat is tested in `DRY_RUN=true` self-test mode.

## When To Run

- After editing `website-ops/product-rules.json`.
- After changing Surikat docs or routing behavior.
- After changing `aim-site-hub.html` or the local preview server.
- After changing QA report schema, screenshot blank-band logic, agent-readability checks, or update cadence docs.
- Before asking someone to review the Website Hub after operational changes.
