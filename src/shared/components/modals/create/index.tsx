"use client";
import * as React from "react";
import { CreateGatheringForm } from "./types";
import { gatheringService } from "@/shared/services/gathering/gathering.service";
import { ModalShell } from "../base";
import StepService from "@/features/createmodal/step-service";
import StepDescription from "@/features/createmodal/step-description";
import StepDate from "@/features/createmodal/step-date";
import Footer from "@/features/createmodal/footer";
export default function CreateGatheringModal({
  open,
  onOpenChange,
  onComplete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: (data: CreateGatheringForm) => void;
}) {
  const [step, setStep] = React.useState(0);
  const maxStep = 2;
  const [form, setForm] = React.useState<CreateGatheringForm>({
    service: null,
    name: "",
    location: "",
    imageFile: null,
    imagePreviewUrl: null,
    date: null,
    registrationEnd: null,
    capacity: "",
  });
  const canNext =
    step === 0
      ? !!form.service
      : step === 1
        ? !!form.name && !!form.location
        : step === 2
          ? !!form.date && !!form.registrationEnd && Number(form.capacity) > 0
          : true;
  const next = () => setStep((s) => Math.min(maxStep, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));
  function close() {
    onOpenChange(false);
  }
  async function handleSubmit() {
    if (!form.service || !form.date || !form.registrationEnd) return;
    try {
      const res = await gatheringService.create({
        type: form.service,
        name: form.name,
        location: form.location,
        dateTime:
          typeof form.date === "string" ? form.date : form.date.toISOString(),
        registrationEnd:
          typeof form.registrationEnd === "string"
            ? form.registrationEnd
            : form.registrationEnd.toISOString(),
        capacity: Number(form.capacity),
        imageFile: form.imageFile ?? undefined,
      });
      onComplete?.(form);
      close();
      console.log("res >>", res);
    } catch (e) {
      console.error("err >>", e);
    }
  }
  return (
    <ModalShell
      open={open}
      onOpenChange={onOpenChange}
      title="모임 만들기"
      subtitle={`${step + 1}/3`}
      contentClassName="h-134 w-85.5 md:h-173 md:w-full"
    >
      {step === 0 && <StepService data={form} onChange={setForm} />}
      {step === 1 && <StepDescription data={form} onChange={setForm} />}
      {step === 2 && <StepDate data={form} onChange={setForm} />}
      <Footer
        step={step}
        maxStep={maxStep}
        canNext={canNext}
        onPrev={prev}
        onNext={next}
        onClose={close}
        onSubmit={handleSubmit}
      />
    </ModalShell>
  );
}
