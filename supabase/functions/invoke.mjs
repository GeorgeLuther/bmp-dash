// supabase/functions/_tools/invoke.mjs
//trigger a Supabase Edge Function locally for testing / migration purposes

import "dotenv/config";

if (process.env.CONFIRM !== "YES") {
  console.error("Refusing to run. Set CONFIRM=YES to execute.");
  process.exit(1);
}

const ref = process.env.SUPABASE_PROJECT_REF;
const key = process.env.SUPABASE_SECRET_KEY;
const fn = process.argv[2]; // e.g., invite_user
const payloadPath = process.argv[3]; // optional JSON file

if (!ref || !key)
  throw new Error("Missing SUPABASE_PROJECT_REF or SUPABASE_SECRET_KEY");
if (!fn) {
  console.error("Usage: node invoke.mjs <functionName> [payload.json]");
  process.exit(1);
}

let body = {};
if (payloadPath) {
  body = JSON.parse(
    (await Bun?.file?.(payloadPath)
      ?.text?.()
      .catch?.(() => null)) ??
      (await import("node:fs/promises")
        .then((fs) => fs.readFile(payloadPath, "utf8"))
        .then(JSON.parse))
  );
}

const url = `https://${ref}.functions.supabase.co/${fn}`;
const res = await fetch(url, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

if (!res.ok) {
  console.error("Invoke failed", res.status, await res.text());
  process.exit(1);
}
console.log(await res.json());
