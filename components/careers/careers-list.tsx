"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  submitApplication,
  type ApplyState,
} from "@/app/(public)/careers/actions";
import type { Vacancy } from "@/lib/types";

const initial: ApplyState = { ok: false };

export function CareersList({ vacancies }: { vacancies: Vacancy[] }) {
  const [open, setOpen] = useState(false);
  const [vacancy, setVacancy] = useState<Vacancy | null>(null);
  const [state, formAction, pending] = useActionState(
    submitApplication,
    initial,
  );

  useEffect(() => {
    if (state.ok) {
      toast.success("Спасибо! Мы получили ваш отклик и свяжемся с вами.");
      setOpen(false);
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  function openFor(v: Vacancy | null) {
    setVacancy(v);
    setOpen(true);
  }

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground">
          Не нашли подходящую вакансию? Оставьте отклик — свяжемся, когда
          появится место.
        </p>
        <Button onClick={() => openFor(null)}>Оставить отклик</Button>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {vacancies.map((v) => (
          <article
            key={v.id}
            className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold">{v.title}</h3>
              {v.salary && (
                <Badge variant="secondary" className="shrink-0">
                  {v.salary}
                </Badge>
              )}
            </div>
            {v.description && (
              <p className="mt-2 flex-1 text-sm text-muted-foreground">
                {v.description}
              </p>
            )}
            <Button
              className="mt-5 w-full"
              variant="outline"
              onClick={() => openFor(v)}
            >
              Откликнуться
            </Button>
          </article>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {vacancy ? `Отклик: ${vacancy.title}` : "Отклик на вакансию"}
            </DialogTitle>
            <DialogDescription>
              Заполните контакты — мы перезвоним. Поля «Имя» и «Телефон»
              обязательны.
            </DialogDescription>
          </DialogHeader>
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="vacancy_id" value={vacancy?.id ?? ""} />
            <div className="space-y-1.5">
              <Label htmlFor="full_name">Имя</Label>
              <Input
                id="full_name"
                name="full_name"
                required
                autoComplete="name"
                placeholder="Как к вам обращаться"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                name="phone"
                required
                inputMode="tel"
                autoComplete="tel"
                placeholder="+7 (___) ___-__-__"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="message">Сообщение</Label>
              <Textarea
                id="message"
                name="message"
                rows={3}
                placeholder="Коротко о себе и опыте (необязательно)"
              />
            </div>
            <DialogFooter>
              <DialogClose render={<Button type="button" variant="outline" />}>
                Отмена
              </DialogClose>
              <Button type="submit" disabled={pending}>
                {pending ? "Отправляем…" : "Отправить отклик"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
