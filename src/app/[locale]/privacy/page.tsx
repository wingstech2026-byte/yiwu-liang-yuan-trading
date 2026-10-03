import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/layout/LegalPage";
import { company, fullAddress } from "@/data/company";
import { resolveLocale, type LocaleParams } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";
import { localePath } from "@/lib/site";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return pageMetadata({
    locale,
    path: "/privacy",
    title: `Privacy Policy | ${company.name}`,
    description: "How Yiwu Liang Yuan Trading Co., Ltd. collects and uses the information you send through this website.",
  });
}

export default async function PrivacyPage({ params }: { params: LocaleParams }) {
  const locale = await resolveLocale(params);
  return (
    <LegalPage locale={locale} title="Privacy Policy">
      <h2>Who we are</h2>
      <p>
        This website is operated by {company.name} ({company.nameZh}), {fullAddress}.      </p>

      <h2>Information we collect</h2>
      <p>When you send an inquiry we collect the information you enter in the form:</p>
      <ul>
        <li>Name, company, country, email address and WhatsApp number (optional)</li>
        <li>Product or category of interest, quantity, target price (optional) and your message</li>
        <li>An optional product reference file (JPG, PNG or PDF) that you upload</li>
      </ul>
      <p>
        We also keep a shortened, one-way hash of your IP address with each inquiry to help detect abuse. We do not ask for payment
        details through this website.
      </p>

      <h2>Live chat</h2>
      <p>
        If you use the live chat on this website, the messages you send, and any details you give in them, are processed by our chat
        provider, Crisp, so that we can reply to you. Please do not share payment card or password details in chat.
      </p>

      <h2>How we use it</h2>
      <p>
        We use your information to respond to your inquiry, prepare quotations and communicate with you about your order. We do not
        sell your personal information.
      </p>

      <h2>Sharing</h2>
      <p>
        We may share the details needed for your request with suppliers, logistics providers and professional advisers who help us
        fulfil it, and where required by law.
      </p>

      <h2>Storage and retention</h2>
      <p>
        Inquiries are stored on our servers and kept for as long as needed to handle your request and maintain business records.
      </p>

      <h2>Analytics and cookies</h2>
      <p>
        Analytics tools are only active if we have enabled them. See our <Link href={localePath(locale, "/cookies")}>Cookie Policy</Link>.
      </p>

      <h2>Your rights</h2>
      <p>
        You may ask us to access, correct or delete the personal information you sent us. Contact us through the{" "}
        <Link href={localePath(locale, "/contact")}>Contact page</Link>.
      </p>

      <h2>Changes</h2>
      <p>We may update this policy from time to time. The date at the top of this page shows when it was last changed.</p>
    </LegalPage>
  );
}
