"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import type { Location } from "@/lib/types";

const YANDEX_KEY = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ymaps?: any;
  }
}

function FallbackMap({
  count,
  reason,
}: {
  count: number;
  reason: "no-key" | "error";
}) {
  return (
    <div className="pattern-east flex h-[420px] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-secondary/40 p-6 text-center">
      <div className="grid size-14 place-items-center rounded-2xl bg-card text-primary shadow-sm">
        <MapPin className="size-7" />
      </div>
      <p className="font-semibold">
        {count} точек на карте Челябинска
      </p>
      <p className="max-w-md text-sm text-muted-foreground">
        {reason === "no-key"
          ? "Интерактивная карта появится после добавления ключа Яндекс.Карт (NEXT_PUBLIC_YANDEX_MAPS_API_KEY). Адреса и маршруты доступны в карточках ниже."
          : "Не удалось загрузить карту. Адреса и маршруты доступны в карточках ниже."}
      </p>
    </div>
  );
}

export function LocationsMap({ locations }: { locations: Location[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  const points = useMemo(
    () => locations.filter((l) => l.lat != null && l.lng != null),
    [locations],
  );

  useEffect(() => {
    if (!YANDEX_KEY || points.length === 0) return;

    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let map: any;

    function init() {
      window.ymaps.ready(() => {
        if (cancelled || !ref.current) return;
        map = new window.ymaps.Map(ref.current, {
          center: [points[0].lat, points[0].lng],
          zoom: 11,
          controls: ["zoomControl", "geolocationControl"],
        });
        points.forEach((p) => {
          const placemark = new window.ymaps.Placemark(
            [p.lat, p.lng],
            { balloonContentHeader: p.name, balloonContentBody: p.address },
            { preset: "islands#orangeFoodIcon" },
          );
          map.geoObjects.add(placemark);
        });
        if (points.length > 1) {
          map.setBounds(map.geoObjects.getBounds(), {
            checkZoomRange: true,
            zoomMargin: 48,
          });
        }
        setStatus("ready");
      });
    }

    if (window.ymaps) {
      init();
    } else {
      const id = "yandex-maps-script";
      const existing = document.getElementById(id) as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener("load", init);
        existing.addEventListener("error", () => setStatus("error"));
      } else {
        const s = document.createElement("script");
        s.id = id;
        s.src = `https://api-maps.yandex.ru/2.1/?apikey=${YANDEX_KEY}&lang=ru_RU`;
        s.async = true;
        s.onload = init;
        s.onerror = () => setStatus("error");
        document.body.appendChild(s);
      }
    }

    return () => {
      cancelled = true;
      if (map) map.destroy();
    };
  }, [points]);

  if (!YANDEX_KEY) return <FallbackMap count={points.length} reason="no-key" />;
  if (status === "error")
    return <FallbackMap count={points.length} reason="error" />;

  return (
    <div className="relative">
      <div
        ref={ref}
        className="h-[420px] w-full overflow-hidden rounded-2xl border border-border"
      />
      {status === "loading" && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center rounded-2xl bg-secondary/40 text-sm text-muted-foreground">
          Загружаем карту…
        </div>
      )}
    </div>
  );
}
