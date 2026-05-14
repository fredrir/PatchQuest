import type { Metadata, Viewport } from "next";
import { Open_Sans, JetBrains_Mono } from "next/font/google";

import {
  BRAND_BG_DARK,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";
import "./globals.css";
import "@mantine/core/styles.layer.css";
import "@mantine/notifications/styles.layer.css";

import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";

import { themeOverride } from "@/theme/theme";
import { AppShellLayout } from "@/components/layout/AppShellLayout";

const sans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: SITE_KEYWORDS,
  authors: [
    {
      name: "Fredrik Carsten Hansteen",
      url: "mailto:fhansteen@gmail.com",
    },
  ],
  creator: "Fredrik Carsten Hansteen",
  publisher: "Fredrik Carsten Hansteen",
  category: "education",
  classification: "Educational",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME}`,
    description: SITE_DESCRIPTION,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME}`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: BRAND_BG_DARK },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      {...mantineHtmlProps}
      className={`${sans.variable} ${mono.variable} h-full`}
    >
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>

      <body className="min-h-screen app-backdrop">
        <MantineProvider theme={themeOverride} defaultColorScheme="auto">
          <ModalsProvider>
            <Notifications position="top-right" autoClose={3500} />
            <AppShellLayout>{children}</AppShellLayout>
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
