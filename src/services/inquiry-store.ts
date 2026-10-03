import { randomUUID } from "node:crypto";
import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { InquiryInput } from "@/lib/validation";

export interface InquiryRecord extends InquiryInput {
  id: string;
  createdAt: string;
  locale: string;
  ipHash: string | null;
  file: { storedAs: string; originalName: string; mime: string; bytes: number } | null;
}

/**
 * Storage abstraction. Implementations below: local files (VPS / local dev) and Netlify Blobs (Netlify).
 * `inquiryStore` tries them in a sensible order and falls back to the next one if a write fails, so
 * the same code works on Netlify (read-only filesystem) and on a normal Node server.
 */
export interface InquiryStore {
  saveInquiry(record: InquiryRecord): Promise<void>;
  saveUpload(id: string, ext: string, data: Uint8Array): Promise<string>;
  list(): Promise<InquiryRecord[]>;
}

// Runtime-configured storage path (deliberately outside the build trace).
const dataDir = () => path.resolve(/*turbopackIgnore: true*/ process.env.INQUIRY_DATA_DIR || "./data/inquiries");

class FileInquiryStore implements InquiryStore {
  private async ensure() {
    await mkdir(path.join(dataDir(), "uploads"), { recursive: true });
  }

  async saveInquiry(record: InquiryRecord) {
    await this.ensure();
    await appendFile(path.join(dataDir(), "inquiries.jsonl"), JSON.stringify(record) + "\n", { encoding: "utf8", mode: 0o600 });
  }

  async saveUpload(id: string, ext: string, data: Uint8Array) {
    await this.ensure();
    // Server-generated name only: the user-supplied filename never touches the filesystem path.
    const storedAs = `${id}-${randomUUID().slice(0, 8)}.${ext}`;
    await writeFile(path.join(dataDir(), "uploads", storedAs), data, { mode: 0o600 });
    return storedAs;
  }

  async list() {
    try {
      const raw = await readFile(path.join(dataDir(), "inquiries.jsonl"), "utf8");
      return raw
        .split("\n")
        .filter(Boolean)
        .map((l) => JSON.parse(l) as InquiryRecord);
    } catch {
      return [];
    }
  }
}

/** Netlify Blobs: durable key-value storage that works from Netlify functions with no extra setup. */
class NetlifyBlobsInquiryStore implements InquiryStore {
  private async store() {
    const { getStore } = await import("@netlify/blobs");
    return getStore({ name: "inquiries", consistency: "strong" });
  }

  async saveInquiry(record: InquiryRecord) {
    const store = await this.store();
    await store.setJSON(`records/${record.createdAt}-${record.id}`, record);
  }

  async saveUpload(id: string, ext: string, data: Uint8Array) {
    const store = await this.store();
    const key = `uploads/${id}-${randomUUID().slice(0, 8)}.${ext}`;
    const copy = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;
    await store.set(key, copy);
    return key;
  }

  async list() {
    const store = await this.store();
    const { blobs } = await store.list({ prefix: "records/" });
    const rows = await Promise.all(blobs.map((b) => store.get(b.key, { type: "json" }) as Promise<InquiryRecord | null>));
    return rows.filter((r): r is InquiryRecord => !!r);
  }
}

/** Tries each store in order; the first one that succeeds wins. */
class FallbackInquiryStore implements InquiryStore {
  constructor(private readonly stores: InquiryStore[]) {}

  private async first<T>(fn: (s: InquiryStore) => Promise<T>): Promise<T> {
    let lastError: unknown;
    for (const store of this.stores) {
      try {
        return await fn(store);
      } catch (err) {
        lastError = err;
      }
    }
    throw lastError;
  }

  saveInquiry(record: InquiryRecord) {
    return this.first((s) => s.saveInquiry(record));
  }
  saveUpload(id: string, ext: string, data: Uint8Array) {
    return this.first((s) => s.saveUpload(id, ext, data));
  }
  list() {
    return this.first((s) => s.list());
  }
}

// On Netlify prefer Blobs (the filesystem there is read-only); elsewhere prefer local files.
const onNetlify = Boolean(process.env.NETLIFY);
export const inquiryStore: InquiryStore = new FallbackInquiryStore(
  onNetlify ? [new NetlifyBlobsInquiryStore(), new FileInquiryStore()] : [new FileInquiryStore(), new NetlifyBlobsInquiryStore()],
);
