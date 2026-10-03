// Structured product data. Shaped so it can later be loaded from a database or CMS:
// replace `products` with a fetch and keep the `Product` type.
//
// `status`:
//   "active"      – real listing (shown normally)
//   "placeholder" – sample entry to be replaced with real product data/photos (shown with a notice)
//   "draft"       – hidden everywhere
//
// IMPORTANT: no prices and no invented specifications. `moq: null` renders as "Contact us".

export type ProductStatus = "active" | "placeholder" | "draft";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string; // category slug
  description: string;
  image: string | null; // null => placeholder tile
  gallery: string[];
  alt: string;
  moq: string | null;
  specifications: { label: string; value: string }[];
  featured: boolean;
  status: ProductStatus;
  videos?: ProductVideo[]; // short clips shown after the photos in the gallery
  illustrative?: boolean; // true when the photos are generic/illustrative, not photos of the exact goods supplied
  note?: string; // extra notice shown on the product page (e.g. compliance)
}

export interface ProductVideo {
  src: string; // H.264 MP4 under /public/videos
  poster: string;
  label: string;
}

const onRequest = "Provided on request";
const inquiryNote =
  "Supplied on inquiry only, subject to documentation, verification and the export, import and compliance rules that apply to the goods and the destination.";

export const products: Product[] = [
  {
    id: "p-copper-cathode",
    slug: "copper-cathode",
    name: "Copper Cathode",
    category: "metal-ores-materials",
    description: "Copper cathode sheets supplied in strapped bundles. Grade, quantity and documentation are confirmed per inquiry.",
    image: "/images/copper-cathode-2.jpg",
    gallery: ["/images/copper-cathode-2.jpg", "/images/copper-cathode-1.jpg", "/images/copper-cathode-3.jpg"],
    alt: "Stacks of strapped copper cathode sheets",
    moq: null,
    specifications: [
      { label: "Form", value: "Cathode sheets, strapped bundles" },
      { label: "Grade / purity", value: onRequest },
      { label: "Packaging", value: onRequest },
    ],
    featured: true,
    status: "active",
  },
  {
    id: "p-copper-concentrate",
    slug: "copper-concentrate",
    name: "Copper Concentrate",
    category: "metal-ores-materials",
    description: "Copper concentrate supplied on inquiry. Grade, origin and documentation are confirmed per order.",
    image: "/images/copper-concentrate-3.jpg",
    gallery: ["/images/copper-concentrate-3.jpg", "/images/copper-concentrate-1.jpg", "/images/copper-concentrate-2.jpg"],
    alt: "Copper concentrate material",
    moq: null,
    specifications: [
      { label: "Grade", value: onRequest },
      { label: "Packaging", value: onRequest },
      { label: "Documentation", value: onRequest },
    ],
    featured: true,
    status: "active",
    illustrative: true,
  },
  {
    id: "p-tantalum",
    slug: "tantalum",
    name: "Tantalum (Ore & Powder)",
    category: "metal-ores-materials",
    description: "Tantalum material supplied on inquiry. Form, grade, origin and documentation are confirmed per order.",
    image: "/images/tantalum-1.jpg",
    gallery: ["/images/tantalum-1.jpg", "/images/tantalum-2.jpg", "/images/tantalum-3.jpg"],
    alt: "Tantalum ore, granules and powder",
    moq: null,
    specifications: [
      { label: "Form", value: onRequest },
      { label: "Grade / content", value: onRequest },
      { label: "Origin & documentation", value: onRequest },
    ],
    featured: false,
    status: "active",
    illustrative: true,
    note: inquiryNote,
  },
  {
    id: "p-gemstones-assorted",
    slug: "assorted-loose-gemstones",
    name: "Assorted Loose Gemstones",
    category: "gemstones",
    description: "Loose cut gemstones in assorted colours, packed in small display boxes. Details are provided on inquiry.",
    image: "/images/gemstone-1.jpg",
    gallery: ["/images/gemstone-1.jpg", "/images/gemstone-2.jpg", "/images/gemstone-6.jpg"],
    alt: "Trays of loose gemstones in small white display boxes",
    moq: null,
    specifications: [
      { label: "Type & cut", value: onRequest },
      { label: "Sizes & weight", value: onRequest },
      { label: "Origin & certification", value: onRequest },
    ],
    featured: false,
    status: "active",
    illustrative: true,
    note: inquiryNote,
  },
  {
    id: "p-gemstones-yellow",
    slug: "yellow-gemstones",
    name: "Yellow & Golden Gemstones",
    category: "gemstones",
    description: "Loose yellow and golden-toned gemstones. Type, sizes and certification are provided on inquiry.",
    image: "/images/gemstone-3.jpg",
    gallery: ["/images/gemstone-3.jpg", "/images/gemstone-2.jpg"],
    alt: "Loose yellow gemstones catching the light",
    moq: null,
    specifications: [
      { label: "Type & cut", value: onRequest },
      { label: "Sizes & weight", value: onRequest },
      { label: "Origin & certification", value: onRequest },
    ],
    featured: false,
    status: "active",
    illustrative: true,
    note: inquiryNote,
  },
  {
    id: "p-gemstones-blue",
    slug: "blue-gemstones",
    name: "Blue Gemstones",
    category: "gemstones",
    description: "Loose blue gemstones. Type, sizes and certification are provided on inquiry.",
    image: "/images/gemstone-4.jpg",
    gallery: ["/images/gemstone-4.jpg"],
    alt: "Loose blue gemstones catching the light",
    moq: null,
    specifications: [
      { label: "Type & cut", value: onRequest },
      { label: "Sizes & weight", value: onRequest },
      { label: "Origin & certification", value: onRequest },
    ],
    featured: false,
    status: "active",
    illustrative: true,
    note: inquiryNote,
  },
  {
    id: "p-gemstones-purple",
    slug: "purple-gemstones",
    name: "Purple Gemstones",
    category: "gemstones",
    description: "Loose purple gemstones. Type, sizes and certification are provided on inquiry.",
    image: "/images/gemstone-5.jpg",
    gallery: ["/images/gemstone-5.jpg"],
    alt: "Loose purple gemstones catching the light",
    moq: null,
    specifications: [
      { label: "Type & cut", value: onRequest },
      { label: "Sizes & weight", value: onRequest },
      { label: "Origin & certification", value: onRequest },
    ],
    featured: false,
    status: "active",
    illustrative: true,
    note: inquiryNote,
  },
  {
    id: "p-gold-bars",
    slug: "gold-bars",
    name: "Gold Bars",
    category: "precious-metals",
    description: "Gold bars supplied on inquiry only. Weight, purity, origin and documentation are confirmed and verified per order.",
    image: "/images/gold-bars-2.jpg",
    gallery: ["/images/gold-bars-2.jpg", "/images/gold-bars-1.jpg", "/images/gold-bars-3.jpg", "/images/gold-bars-4.jpg"],
    alt: "Rows of gold bars (illustrative image)",
    moq: null,
    specifications: [
      { label: "Weight & purity", value: onRequest },
      { label: "Origin & documentation", value: onRequest },
      { label: "Verification & compliance", value: onRequest },
    ],
    featured: false,
    status: "active",
    illustrative: true,
    note: inquiryNote,
  },
  {
    id: "p-lb-ambilight",
    slug: "lalla-bella-ambilight",
    name: "Lalla Bella “AMBILight” Fragrance",
    category: "cosmetics",
    description: "Fragrance from the Lalla Bella range, shown with its gift packaging. Sizes and ordering details on request.",
    image: "/images/perfume-5.jpg",
    gallery: ["/images/perfume-5.jpg", "/images/perfume-1.jpg"],
    videos: [{ src: "/videos/perfume-1.mp4", poster: "/videos/perfume-1-poster.jpg", label: "AMBILight gift boxes" }],
    alt: "Lalla Bella AMBILight fragrance bottle with yellow gift box",
    moq: null,
    specifications: [
      { label: "Brand", value: "Lalla Bella" },
      { label: "Bottle sizes", value: onRequest },
      { label: "Packaging", value: "Gift box (see photos)" },
    ],
    featured: true,
    status: "active",
  },
  {
    id: "p-lb-golden-grace",
    slug: "lalla-bella-golden-grace",
    name: "Lalla Bella “Golden Grace” Fragrance",
    category: "cosmetics",
    description: "Fragrance from the Lalla Bella range, shown with its gift packaging. Sizes and ordering details on request.",
    image: "/images/perfume-3.jpg",
    gallery: ["/images/perfume-3.jpg", "/images/perfume-6.jpg"],
    videos: [{ src: "/videos/perfume-4.mp4", poster: "/videos/perfume-4-poster.jpg", label: "Golden Grace gift boxes" }],
    alt: "Lalla Bella Golden Grace fragrance bottle beside its box",
    moq: null,
    specifications: [
      { label: "Brand", value: "Lalla Bella" },
      { label: "Bottle sizes", value: onRequest },
      { label: "Packaging", value: "Gift box (see photos)" },
    ],
    featured: true,
    status: "active",
  },
  {
    id: "p-lb-pink-wish",
    slug: "lalla-bella-a-pink-wish",
    name: "Lalla Bella “A Pink Wish” Fragrance",
    category: "cosmetics",
    description: "Fragrance from the Lalla Bella range, shown with its gift box. Sizes and ordering details on request.",
    image: "/images/perfume-2.jpg",
    gallery: ["/images/perfume-2.jpg"],
    videos: [{ src: "/videos/perfume-2.mp4", poster: "/videos/perfume-2-poster.jpg", label: "A Pink Wish gift boxes" }],
    alt: "Lalla Bella A Pink Wish fragrance bottle with pink gift box",
    moq: null,
    specifications: [
      { label: "Brand", value: "Lalla Bella" },
      { label: "Bottle sizes", value: onRequest },
    ],
    featured: false,
    status: "active",
  },
  {
    id: "p-lb-glass-bottle",
    slug: "lalla-bella-glass-bottle-sample",
    name: "Lalla Bella Fragrance Sample (Glass Bottle)",
    category: "cosmetics",
    description: "Fragrance sample in a clear glass bottle from the Lalla Bella range. Details on request.",
    image: "/images/perfume-4.jpg",
    gallery: ["/images/perfume-4.jpg"],
    videos: [{ src: "/videos/perfume-3.mp4", poster: "/videos/perfume-3-poster.jpg", label: "Lalla Bella brand video" }],
    alt: "Lalla Bella fragrance in a clear glass bottle",
    moq: null,
    specifications: [
      { label: "Brand", value: "Lalla Bella" },
      { label: "Bottle sizes", value: onRequest },
    ],
    featured: false,
    status: "active",
  },
  // ---- Placeholder entries: replace with real products, specifications and photos ----
  ...(
    [
      ["hardware-tools", "Hardware & Tools — Sample Listing", "p-ph-hardware"],
      ["clothing-apparel", "Clothing & Apparel — Sample Listing", "p-ph-clothing"],
      ["building-materials", "Building Materials — Sample Listing", "p-ph-building"],
      ["auto-parts", "Auto Parts — Sample Listing", "p-ph-auto"],
      ["household-appliances", "Household Appliances — Sample Listing", "p-ph-appliances"],
      ["photovoltaic", "Photovoltaic Products — Sample Listing", "p-ph-pv"],
    ] as const
  ).map(
    ([category, name, id]): Product => ({
      id,
      slug: id.replace("p-ph-", "sample-"),
      name,
      category,
      description: "Placeholder listing. Send us your product requirements and we will source suitable options.",
      image: null,
      gallery: [],
      alt: "",
      moq: null,
      specifications: [{ label: "Details", value: "[ADD PRODUCT SPECIFICATIONS]" }],
      featured: false,
      status: "placeholder",
    }),
  ),
];

export const visibleProducts = products.filter((p) => p.status !== "draft");
export const featuredProducts = visibleProducts.filter((p) => p.featured);
export const productBySlug = (slug: string) => visibleProducts.find((p) => p.slug === slug);
export const relatedProducts = (p: Product, limit = 3) =>
  visibleProducts.filter((x) => x.category === p.category && x.id !== p.id).slice(0, limit);
