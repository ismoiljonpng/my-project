import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = { title: "Контакты" };

export default function ContactsPage() {
  return (
    <PagePlaceholder
      title="Контакты"
      description="Все 10 точек на карте Челябинска, адреса, телефоны и часы работы появятся на этапе 3."
    />
  );
}
