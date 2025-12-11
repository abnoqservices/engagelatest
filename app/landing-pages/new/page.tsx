"use client";

import dynamic from "next/dynamic";
import { usePageStore } from "@/lib/pageStore";
const Builder = dynamic(() => import("./page.client"), {
  ssr: false,
});

export default function Page() {
    const { templateId, userId }  = usePageStore();
  return <Builder templateId={templateId} userId={userId} />;
}
