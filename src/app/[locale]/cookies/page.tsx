import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { company } from "@/data/company";
import { resolveLocale, type LocaleParams } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({
    locale,
    path: "/cookies",
    title: `Cookie Policy | ${company.name}`,
    description: "Which cookies and similar technologies the Yiwu Liang Yuan Trading Co., Ltd. website uses.",
  });
}

export default async function CookiesPage({ params }: { params: LocaleParams }) {
  const locale = await resolveLocale(params);
  return (
    <LegalPage locale={locale} title="Cookie Policy">
      <h2>What this website stores</h2>
      <p>
        This website does not set advertising or tracking cookies of its own. It does not use cookies to log you in, because there
        are no customer accounts.
      </p>

      <h2>Analytics</h2>
      <p>
        If we enable an analytics or advertising tool (for example Google Analytics or Meta Pixel), that provider may set cookies or
        similar identifiers to measure visits. These tools load only when we have configured them,.
      </p>

      <h2>Controlling cookies</h2>
      <p>You can block or delete cookies in your browser settings. Blocking cookies does not stop you from browsing the site or sending an inquiry.</p>
    </LegalPage>
  );
}
