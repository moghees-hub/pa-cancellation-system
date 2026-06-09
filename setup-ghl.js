// One-off script: creates the 12 custom contact fields + 4 tags in GHL
// Run: node setup-ghl.js
// Requires env vars: GHL_API_KEY, GHL_LOCATION_ID
//
// Idempotent-ish: fetches existing fields/tags first and skips anything that already exists.

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const BASE = "https://services.leadconnectorhq.com";

if (!GHL_API_KEY || !GHL_LOCATION_ID) {
  console.error("Missing GHL_API_KEY or GHL_LOCATION_ID in env. Aborting.");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${GHL_API_KEY}`,
  Version: "2021-07-28",
  "Content-Type": "application/json",
  Accept: "application/json",
};

// Coach skipped — already exists as a TEXT field in the account, reuse it.
const FIELDS = [
  { name: "Programme",                  dataType: "TEXT" },
  { name: "Programme Start Date",       dataType: "DATE" },
  { name: "Payment Date (Day of Month)", dataType: "NUMERICAL" },
  { name: "Billing Terms Sent At",      dataType: "DATE" },
  { name: "Billing Terms Signed At",    dataType: "DATE" },
  { name: "Last 7-Day Notice Sent At",  dataType: "DATE" },
  { name: "Cancellation Requested At",  dataType: "DATE" },
  { name: "Cancellation Reference",     dataType: "TEXT" },
  {
    name: "Cancellation Reason",
    dataType: "SINGLE_OPTIONS",
    options: [
      "Achieved my goals",
      "Financial reasons",
      "Lack of time",
      "Moving to a different programme",
      "Not satisfied with the service",
      "Personal circumstances",
      "Other",
    ],
  },
  { name: "Cancellation Reason Detail", dataType: "LARGE_TEXT" },
  {
    name: "Cancellation Status",
    dataType: "SINGLE_OPTIONS",
    options: ["Requested", "Confirmed", "Completed"],
  },
];

const TAGS = [
  "billing-terms-sent",
  "billing-terms-signed",
  "cancellation-requested",
  "cancellation-confirmed",
];

async function listCustomFields() {
  const res = await fetch(
    `${BASE}/locations/${GHL_LOCATION_ID}/customFields?model=contact`,
    { headers }
  );
  if (!res.ok) {
    throw new Error(`List custom fields failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.customFields || [];
}

async function listTags() {
  const res = await fetch(
    `${BASE}/locations/${GHL_LOCATION_ID}/tags`,
    { headers }
  );
  if (!res.ok) {
    throw new Error(`List tags failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.tags || [];
}

async function createCustomField(field) {
  const body = {
    name: field.name,
    dataType: field.dataType,
    placeholder: "",
    position: 0,
    model: "contact",
  };
  if (field.options) body.options = field.options;

  const res = await fetch(
    `${BASE}/locations/${GHL_LOCATION_ID}/customFields`,
    { method: "POST", headers, body: JSON.stringify(body) }
  );
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${res.status} ${text}`);
  }
  return JSON.parse(text);
}

async function createTag(name) {
  const res = await fetch(
    `${BASE}/locations/${GHL_LOCATION_ID}/tags`,
    { method: "POST", headers, body: JSON.stringify({ name }) }
  );
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${res.status} ${text}`);
  }
  return JSON.parse(text);
}

(async () => {
  console.log("Fetching existing fields + tags...");
  const [existingFields, existingTags] = await Promise.all([
    listCustomFields(),
    listTags(),
  ]);

  const existingFieldNames = new Set(existingFields.map((f) => f.name));
  const existingTagNames = new Set(existingTags.map((t) => (t.name || "").toLowerCase()));

  console.log(`Found ${existingFields.length} existing custom fields, ${existingTags.length} existing tags.\n`);

  console.log("Creating custom fields...");
  for (const f of FIELDS) {
    if (existingFieldNames.has(f.name)) {
      console.log(`  SKIP  ${f.name} (already exists)`);
      continue;
    }
    try {
      const created = await createCustomField(f);
      console.log(`  OK    ${f.name} (${f.dataType})`);
    } catch (err) {
      console.log(`  FAIL  ${f.name}: ${err.message}`);
    }
  }

  console.log("\nCreating tags...");
  for (const t of TAGS) {
    if (existingTagNames.has(t.toLowerCase())) {
      console.log(`  SKIP  ${t} (already exists)`);
      continue;
    }
    try {
      await createTag(t);
      console.log(`  OK    ${t}`);
    } catch (err) {
      console.log(`  FAIL  ${t}: ${err.message}`);
    }
  }

  console.log("\nDone.");
})().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
