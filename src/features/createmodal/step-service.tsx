"use client";

import { SERVICES } from "@/shared/components/modals/create/constants";
import {
  CreateGatheringForm,
  ServiceType,
} from "@/shared/components/modals/create/types";
import Image from "next/image";
import * as React from "react";

export default function StepService({
  data,
  onChange,
}: {
  data: CreateGatheringForm;
  onChange: (d: CreateGatheringForm) => void;
}) {
  function selectService(key: ServiceType) {
    onChange({ ...data, service: key });
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-700">원하시는 서비스를 선택해주세요</p>

      <div className="space-y-3">
        {SERVICES.map((s) => {
          const active = data.service === s.key;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => selectService(s.key)}
              className={[
                "w-full rounded-2xl border-[2px] p-4 text-left transition focus:outline-none",
                active
                  ? "border-transparent [background:linear-gradient(#ECFDF5,#ECFDF5)_padding-box,linear-gradient(90deg,#17DA71,#08DDF0)_border-box]"
                  : "border-transparent bg-[#F7F7F7] hover:bg-zinc-50",
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <Image src={s.icon} alt="" width={40} height={40} />
                <div>
                  <div className="font-semibold text-emerald-700">
                    {s.title}
                  </div>
                  {s.subtitle && (
                    <div className="text-sm text-gray-500">{s.subtitle}</div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
