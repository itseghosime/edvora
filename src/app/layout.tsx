import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  title: "Edvora Nursery & Primary School | Benin City, Edo State",
  description:
    "Official school portal and website for Edvora Nursery & Primary School. Balanced early education, transparent fee management, and published term results.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Plus+Jakarta+Sans:wght@100..900&display=swap"
        />
      </head>
      <body className="bg-surface font-body-md text-on-surface min-h-screen selection:bg-primary-fixed selection:text-primary">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
