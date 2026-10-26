import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { getSiteUrl } from "@/lib/site-url";
import { LANGS, isLang } from "@/lib/i18n";
import { getMetaCopy } from "@/lib/copy";
import { getLang } from "@/lib/lang-server";
import { fontVars } from "@/app/fonts";
import { LangProvider } from "@/components/site/LangProvider";
import "../globals.css";

const GA_MEASUREMENT_ID = "G-9VJNFLH7WE";
const CLARITY_PROJECT_ID = "yr1egwjk6w";

const SITE_URL = getSiteUrl();

// Solo existen /es (interno, servido en las URLs sin prefijo) y /en.
export const dynamicParams = false;

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const meta = getMetaCopy(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: meta.home.title,
      template: meta.templateTitulo,
    },
    description: meta.home.description,
    openGraph: {
      type: "website",
      locale: lang === "en" ? "en_US" : "es_AR",
      alternateLocale: lang === "en" ? "es_AR" : "en_US",
      title: meta.home.title,
      description: meta.home.description,
      url: lang === "en" ? `${SITE_URL}/en` : SITE_URL,
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <html lang={lang} className={fontVars}>
      <body className="min-h-dvh">
        <div className="bg-aurora" aria-hidden />
        <div className="bg-grain" aria-hidden />
        <LangProvider lang={lang}>{children}</LangProvider>
        <Analytics />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <Script id="clarity-tag" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
          `}
        </Script>
      </body>
    </html>
  );
}
