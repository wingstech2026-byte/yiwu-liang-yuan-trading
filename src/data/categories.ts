import type { IconName } from "@/components/ui/Icon";

export interface Category {
  slug: string;
  name: string;
  shortName: string; // used in filter chips
  description: string;
  icon: IconName;
  image?: string;
  imageAlt?: string;
}

// Mirrors the company's licensed business scope. Add a category here and it appears
// in the homepage grid, the products filter and the inquiry form automatically.
export const categories: Category[] = [
  { slug: "daily-necessities", name: "Daily Necessities", shortName: "Daily Necessities", description: "Household and everyday-use products.", icon: "home" },
  { slug: "hardware-tools", name: "Hardware & Tools", shortName: "Hardware", description: "Hardware, metal tools, materials and related products.", icon: "wrench" },
  { slug: "clothing-apparel", name: "Clothing & Apparel", shortName: "Clothing", description: "Clothing and apparel products.", icon: "shirt" },
  {
    slug: "cosmetics",
    name: "Cosmetics",
    shortName: "Cosmetics",
    description: "Beauty, fragrance and personal-care related products.",
    icon: "sparkle",
    image: "/images/perfume-3.jpg",
    imageAlt: "Lalla Bella Golden Grace fragrance bottle and gift box",
  },
  { slug: "machinery-equipment", name: "Machinery & Equipment", shortName: "Machinery", description: "Industrial machinery, mechanical equipment and related products.", icon: "cog" },
  { slug: "building-materials", name: "Building Materials", shortName: "Building Materials", description: "Construction-related products and materials.", icon: "bricks" },
  { slug: "auto-parts", name: "Auto Parts", shortName: "Auto Parts", description: "Automotive components and accessories.", icon: "car" },
  { slug: "household-appliances", name: "Household Appliances", shortName: "Household Appliances", description: "Household electrical appliances and related products.", icon: "plug" },
  { slug: "kitchen-sanitary", name: "Kitchen & Sanitary Products", shortName: "Kitchen & Sanitary", description: "Kitchenware, sanitary ware and daily-use products.", icon: "faucet" },
  { slug: "agricultural-livestock-equipment", name: "Agricultural & Livestock Equipment", shortName: "Agri & Livestock", description: "Livestock machinery and related equipment.", icon: "sprout" },
  { slug: "electrical-mechanical", name: "Electrical & Mechanical Products", shortName: "Electrical & Mechanical", description: "Mechanical and electrical equipment.", icon: "bolt" },
  { slug: "photovoltaic", name: "Photovoltaic Products", shortName: "Photovoltaic", description: "Photovoltaic equipment and components.", icon: "sun" },
  { slug: "batteries-components", name: "Batteries & Components", shortName: "Batteries", description: "Battery spare parts and battery sales.", icon: "battery" },
  {
    slug: "metal-ores-materials",
    name: "Metal Ores & Materials",
    shortName: "Metal Ores",
    description: "Metal ores and metal materials, including copper products, supplied on inquiry.",
    icon: "layers",
    image: "/images/copper-cathode-2.jpg",
    imageAlt: "Stacks of strapped copper cathode sheets inside a warehouse",
  },
  { slug: "furniture-doors-timber", name: "Furniture, Doors & Timber", shortName: "Furniture & Timber", description: "Doors, windows, furniture and timber products.", icon: "door" },
  {
    slug: "other-products",
    name: "Other Products",
    shortName: "Other",
    description: "Prepackaged food, Class I medical products, fire-fighting equipment and other items available through our trading and sourcing network.",
    icon: "grid",
  },
];

export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);
