"use client";

import * as React from "react";
import Card from "@/shared/components/card";
import type { Gathering } from "@/shared/services/gathering/gathering.service";

export function ItemsGrid({ items }: { items: Gathering[] }) {
  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-3">
      {items.map((g) => (
        <Card
          key={g.id}
          id={g.id}
          title={g.name}
          location={g.location}
          dateTimeISO={g.dateTime}
          registrationEndISO={g.registrationEnd ?? undefined}
          participantCount={g.participantCount}
          capacity={g.capacity}
          image={g.image ?? undefined}
          isCanceled={!!g.canceledAt}
        />
      ))}
    </div>
  );
}
