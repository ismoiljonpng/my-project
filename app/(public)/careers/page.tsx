import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = { title: "Вакансии" };

export default function CareersPage() {
  return (
    <PagePlaceholder
      title="Вакансии"
      description="Список вакансий и форма отклика появятся на этапе 3."
    />
  );
}
