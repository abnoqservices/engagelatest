import { Metadata } from "next";
import LandingPageClient from "./LandingPageClient";
import axiosClient from "@/lib/axiosClient";


export default async function LandingPage({ params }) {
  const { slug } = await params;
return <LandingPageClient slug={slug} />;
}
