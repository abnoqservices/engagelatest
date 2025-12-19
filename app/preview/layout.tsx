// app/preview/layout.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Landing Page Preview",
  description: "Preview your landing page design",
  robots: { index: false, follow: false },
};

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}