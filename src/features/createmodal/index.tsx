"use client";

import * as React from "react";
import { Dialog, DialogContent } from "@/shadcn/dialog";

import StepService from "./step-service";
import StepDescription from "./step-description";
import StepDate from "./step-date";
import Footer from "./footer";
import { Header } from "./header";
import { CreateGatheringForm } from "@/shared/components/modals/create/types";
import { gatheringService } from "@/shared/services/gathering/gathering.service";

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

  function next() {
    setStep((s) => Math.min(maxStep, s + 1));
  }
  function prev() {
    setStep((s) => Math.max(0, s - 1));
  }
  function close() {
    onOpenChange(false);
  }

  const canNext =
    step === 0
      ? !!form.service
      : step === 1
        ? !!form.name && !!form.location
        : step === 2
          ? !!form.date && !!form.registrationEnd && Number(form.capacity) > 0
          : true;

  async function handleSubmit() {
    if (!form.service || !form.date || !form.registrationEnd) {
      console.error("필수 값이 누락되었습니다");
      return;
    }

    try {
      const res = await gatheringService.create({
        type: form.service,
        name: form.name,
        location: form.location,
        dateTime: form.date.toISOString(),
        registrationEnd: form.registrationEnd.toISOString(),
        capacity: Number(form.capacity),
        imageFile: form.imageFile ?? undefined,
      });

      console.log("성공 res>>", res);
      onComplete?.(form);
      close();
    } catch (err) {
      console.error("실패 err >>>:", err);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`h-134 w-85.5 rounded-3xl px-6 py-8 md:h-173 md:w-full md:p-12`}
      >
        <Header title="모임 만들기" subtitle={`${step + 1}/3`} />

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
      </DialogContent>
    </Dialog>
  );
}
