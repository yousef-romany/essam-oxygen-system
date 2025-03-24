import type { Metadata } from "next";
import type React from "react";
import { ThemeProvider } from "./NextThemesProvider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "إدارة مخزون أسطوانات الغاز",
  description: "لوحة تحكم حديثة لتتبع مخزون أسطوانات الغاز",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
