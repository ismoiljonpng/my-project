import type { Metadata } from "next";
import { Briefcase } from "lucide-react";
import { getActiveVacancies } from "@/lib/queries";
import { CareersList } from "@/components/careers/careers-list";
import { EmptyState, ErrorState } from "@/components/states";

export const metadata: Metadata = {
  title: "Вакансии",
  description:
    "Работа в сети узбекской кухни AL-ABBOS в Челябинске: повара, кассиры, курьеры.",
};

export default async function CareersPage() {
  const { data, error } = await getActiveVacancies();
  const vacancies = data ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Вакансии
        </h1>
        <p className="mt-3 text-muted-foreground">
          Присоединяйтесь к команде AL-ABBOS. Любим своё дело и тех, кто готовит
          и доставляет с душой.
        </p>
      </header>

      {error ? (
        <ErrorState description="Не получилось загрузить вакансии. Обновите страницу чуть позже." />
      ) : vacancies.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="Открытых вакансий пока нет"
          description="Загляните позже — новые вакансии появляются регулярно."
        />
      ) : (
        <CareersList vacancies={vacancies} />
      )}
    </div>
  );
}
