import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = { title: "О нас" };

export default function AboutPage() {
  return (
    <PagePlaceholder
      title="О нас"
      description="История сети, ценности и фото появятся на этапе 3 (текст редактируется из админки)."
    />
  );
}
