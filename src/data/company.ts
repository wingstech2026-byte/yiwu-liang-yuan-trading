// Single source of truth for company facts.
// VERIFIED values come from the company's own documents (Yiwu_LiangYuan_Sitemap.pdf and the logo).
// Anything not provided is `null` — the UI then shows a clearly marked placeholder or hides the item.
// Never put guessed values here.

export const company = {
  name: "Yiwu Liang Yuan Trading Co., Ltd.",
  nameZh: "义乌市粮垣贸易有限公司",
  legalRepresentative: "KARIFALA MARAH",
  established: "2022-07-27",
  establishedLabel: "July 27, 2022",
  registeredCapital: "RMB 1,000,000",
  entityType: "Limited Liability Company (sole proprietorship of a foreign natural person)",
  address: {
    street: "B3-326, Block B, Jin Fu Yuan",
    city: "Yiwu City",
    region: "Zhejiang Province",
    country: "China",
    countryCode: "CN",
  },
  // ---- TO BE PROVIDED BY THE COMPANY — leave null until real values exist ----
  contact: {
    email: null as string | null, // e.g. "sales@yourdomain.com"
    phone: null as string | null, // international format, e.g. "+86 ..."
    whatsapp: null as string | null, // digits with country code, e.g. "86..."
    wechat: null as string | null, // WeChat ID
  },
  documents: {
    businessLicenseImage: null as string | null, // e.g. "/documents/business-license.jpg"
    certifications: [] as { name: string; image?: string }[],
  },
} as const;

// Website credit shown in the footer (the developer's details, not the company's contact channels).
export const developer = {
  name: "S.A. Marrah",
  whatsapp: "+8619382020640" as string | null, // international format; null hides the link
} as const;

export const fullAddress = `${company.address.street}, ${company.address.city}, ${company.address.region}, ${company.address.country}`;

export const placeholders = {
  email: "[ADD COMPANY EMAIL]",
  phone: "[ADD PHONE NUMBER]",
  whatsapp: "[ADD WHATSAPP NUMBER]",
  wechat: "[ADD WECHAT ID]",
} as const;

export type ChannelKey = keyof typeof placeholders;

export interface Channel {
  key: ChannelKey;
  label: string;
  value: string | null;
  href: string | null;
  placeholder: string;
}

export function getChannels(): Channel[] {
  const c = company.contact;
  const digits = (s: string) => s.replace(/[^\d]/g, "");
  return [
    { key: "whatsapp", label: "WhatsApp", value: c.whatsapp, href: c.whatsapp ? `https://wa.me/${digits(c.whatsapp)}` : null, placeholder: placeholders.whatsapp },
    { key: "wechat", label: "WeChat", value: c.wechat, href: null, placeholder: placeholders.wechat },
    { key: "email", label: "Email", value: c.email, href: c.email ? `mailto:${c.email}` : null, placeholder: placeholders.email },
    { key: "phone", label: "Phone", value: c.phone, href: c.phone ? `tel:${c.phone.replace(/[^\d+]/g, "")}` : null, placeholder: placeholders.phone },
  ];
}

/** Items of the licensed business scope exactly as provided in the company documents. */
export const businessScope = [
  "Daily necessities",
  "Hardware products",
  "Clothing and apparel",
  "Cosmetics",
  "Livestock machinery",
  "Metal tools and materials",
  "Machinery and equipment",
  "Prepackaged food",
  "Doors and windows",
  "Furniture",
  "Timber",
  "Auto parts",
  "Building materials",
  "Class I medical products",
  "Fire-fighting equipment",
  "Metal ores",
  "Kitchenware",
  "Sanitary ware",
  "Daily-use products",
  "Household appliances",
  "Import and export of goods",
  "Photovoltaic equipment and components",
  "Mechanical and electrical equipment",
  "Battery spare parts and battery sales",
] as const;
