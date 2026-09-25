import type { Metadata, Viewport } from "next";
import { Archivo, Source_Serif_4 } from "next/font/google";
import Providers from "@/components/Providers";
import Preloader from "@/components/Preloader";
import Interactions from "@/components/Interactions";
import Nav from "@/components/Nav";
import { site } from "@/content";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

// Upright serif is on the LCP path (the statement), so it is preloaded; the
// italic only carries a few emphasised words and loads on demand.
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  style: ["normal"],
  variable: "--font-source-serif",
  display: "swap",
});
const sourceSerifItalic = Source_Serif_4({
  subsets: ["latin"],
  style: ["italic"],
  variable: "--font-source-serif-italic",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    title: site.title,
    description: site.description,
    siteName: site.name,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
  colorScheme: "light",
};

// Locks scrolling before hydration so the preloader can run without a scrollbar jump.
const loadingScript = `if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('is-loading')}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${sourceSerif.variable} ${sourceSerifItalic.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: loadingScript }} />
        <a className="skip" href="#work">
          Skip to work
        </a>
        <Providers>
          <Preloader />
          <Interactions />
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
