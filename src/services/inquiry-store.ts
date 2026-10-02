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
 * Storage abstraction. The file-based implementation below is the default.
 * To move to a database or send email, implement this interface and export it as `inquiryStore`.
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

export const inquiryStore: InquiryStore = new FileInquiryStore();
