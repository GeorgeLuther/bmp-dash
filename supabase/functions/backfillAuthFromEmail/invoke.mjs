import fetch from "node-fetch";

const projectRef = "mkellhmkhouxkmyysikx"; // e.g., abcdefghijklmnopqrst
const serviceRoleKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rZWxsaG1raG91eGtteXlzaWt4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODI0NjU2OCwiZXhwIjoyMDUzODIyNTY4fQ.HifoUzY0IOBhtA1v1vgIOiCUiX7BIsrqbov0C-Do-qA";

if (!serviceRoleKey) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
}

const url = `https://${projectRef}.functions.supabase.co/backfillAuthFromEmail`;

const run = async () => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  const result = await res.json();
  console.log(JSON.stringify(result, null, 2));
};

run().catch(console.error);
