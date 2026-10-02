// Lists stored inquiries: `npm run inquiries` (add `-- --json` for raw output).
import { readFile } from "node:fs/promises";
import path from "node:path";

const dir = path.resolve(process.env.INQUIRY_DATA_DIR || "./data/inquiries");
let raw = "";
try {
  raw = await readFile(path.join(dir, "inquiries.jsonl"), "utf8");
} catch {
  console.log(`No inquiries yet (looked in ${dir}).`);
  process.exit(0);
}
const rows = raw.split("\n").filter(Boolean).map((l) => JSON.parse(l));
if (process.argv.includes("--json")) {
  console.log(JSON.stringify(rows, null, 2));
} else {
  console.log(`${rows.length} inquiries in ${dir}\n`);
  for (const r of rows.reverse()) {
    console.log(`── ${r.createdAt}  ${r.id}`);
    console.log(`   ${r.name}${r.company ? ` (${r.company})` : ""} · ${r.country} · ${r.email}${r.whatsapp ? ` · WhatsApp ${r.whatsapp}` : ""}`);
    console.log(`   Product: ${r.product}${r.quantity ? ` · Qty: ${r.quantity}` : ""}${r.targetPrice ? ` · Target: ${r.targetPrice}` : ""}`);
    console.log(`   ${r.message.replace(/\n/g, "\n   ")}`);
    if (r.file) console.log(`   Attachment: uploads/${r.file.storedAs} (${r.file.originalName}, ${r.file.bytes} bytes)`);
    console.log();
  }
}
