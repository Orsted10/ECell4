import type { Metadata, Viewport } from "next";
import { Anton, Archivo, Space_Mono } from "next/font/google";
import "./globals.css";
import { SITE } from "@/data/content";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const archivo = Archivo({
  weight: ["400", "500", "600", "700", "900"],
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "E-CELL — Chandigarh University, Uttar Pradesh",
  description:
    "E-Cell Chandigarh University Uttar Pradesh is a place to start. An ecosystem where ideas become questions, questions become teams, and teams become impact. Everything starts with an idea.",
  keywords: [
    "E-Cell",
    "Chandigarh University",
    "Uttar Pradesh",
    "entrepreneurship",
    "startup",
    "innovation",
    "incubation",
    "E-Cell CU UP",
  ],
  openGraph: {
    title: "E-CELL — Chandigarh University, Uttar Pradesh",
    description:
      "A place to start. An ecosystem where one idea becomes something much bigger.",
    type: "website",
    siteName: "E-Cell Chandigarh University Uttar Pradesh",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "E-CELL — Chandigarh University, Uttar Pradesh",
    description: "A place to start. Everything starts with an idea.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${archivo.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <body className="grain">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: SITE.name,
              alternateName: "E-Cell Chandigarh University Uttar Pradesh",
              url: SITE.url,
              email: SITE.email,
              description: SITE.tagline,
              address: {
                "@type": "PostalAddress",
                addressLocality: "Uttar Pradesh",
                addressCountry: "IN",
              },
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
