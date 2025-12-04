"use client";

import dynamic from "next/dynamic";
import { usePageStore } from "@/lib/pageStore";
const Builder = dynamic(() => import("./page.client"), {
  ssr: false,
});

export default function Page() {
    const { templateId, userId }  = usePageStore();
    console.log("Rendering Builder with templateId:", templateId, "and userId:", userId);
  return <Builder templateId={templateId} userId={userId} />;
}
