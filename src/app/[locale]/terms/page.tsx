import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { company } from "@/data/company";
import { resolveLocale, type LocaleParams } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({
    locale,
    path: "/terms",
    title: `Terms of Service | ${company.name}`,
    description: "Terms for using the Yiwu Liang Yuan Trading Co., Ltd. website and requesting quotations.",
  });
}

export default async function TermsPage({ params }: { params: LocaleParams }) {
  const locale = await resolveLocale(params);
  return (
    <LegalPage locale={locale} title="Terms of Service">
      <h2>Use of this website</h2>
      <p>
        This website is provided by {company.name} to present our company and products to international buyers. By using it you agree
        to these terms.
      </p>

      <h2>Information, not offers</h2>
      <p>
        Product descriptions and images are for information only. They are not a binding offer. Availability, specifications, prices
        and trade terms are confirmed in a written quotation or order confirmation agreed between you and us.
      </p>

      <h2>Quotations and orders</h2>
      <p>
        A submitted inquiry does not create a contract. A contract is formed only when both parties have confirmed the order details
        in writing. Payment terms, shipping arrangements and delivery times are agreed for each order.
      </p>

      <h2>Product images</h2>
      <p>
        Images may be illustrative. Actual products, packaging and specifications are confirmed before an order is placed.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The content of this website, including text, layout and logos, belongs to {company.name} or its licensors and may not be
        copied or reused without permission. Brand names shown belong to their respective owners.
      </p>

      <h2>Acceptable use</h2>
      <p>
        Do not misuse the website, attempt to disrupt it, or submit unlawful, false or misleading information through the inquiry form.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        We take reasonable care to keep the website accurate but provide it “as is”. To the extent permitted by law we are not liable
        for losses arising from reliance on website content instead of a written quotation.
      </p>

      <h2>Governing law</h2>
      <p>[ADD GOVERNING LAW AND DISPUTE-RESOLUTION CLAUSE — to be confirmed with the company’s legal adviser]</p>
    </LegalPage>
  );
}
