"use client";
import * as React from "react";
import { CreateGatheringForm } from "./types";
import { gatheringService } from "@/shared/services/gathering/gathering.service";
import { ModalShell } from "../base";
import StepService from "@/features/createmodal/step-service";
import StepDescription from "@/features/createmodal/step-description";
import StepDate from "@/features/createmodal/step-date";
import Footer from "@/features/createmodal/footer";
import { validateAndBuildPayload } from "./schemas/createModal.schema";

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
  const close = () => onOpenChange(false);
  async function handleSubmit() {
    const result = validateAndBuildPayload(form);
    if (!result.ok) {
      const issue = result.error.issues?.[0];
      const field = (issue?.path?.[0] as string) || "";
      const msg = issue?.message || "입력값을 확인해주세요.";

      if (field === "service") setStep(0);
      else if (
        ["name", "location", "imageFile", "imagePreviewUrl"].includes(field)
      )
        setStep(1);
      else if (["date", "registrationEnd", "capacity"].includes(field))
        setStep(2);

      alert(msg);
      return;
    }

    try {
      await gatheringService.create(result.payload);
      onComplete?.(form);
      close();
    } catch (e) {
      const err = e as {
        response?: { status?: number; data?: { message?: string } };
        message?: string;
      };
      const status = err.response?.status;
      const msg =
        err.response?.data?.message ?? err.message ?? "요청에 실패했습니다.";

      if (status === 401) {
        alert(msg);
        return;
      }
      alert(msg);
    }
  }

  return (
    <ModalShell
      open={open}
      onOpenChange={onOpenChange}
      title="모임 만들기"
      subtitle={`${step + 1}/3`}
      contentClassName="h-134 w-85.5 md:h-173 md:w-full"
      footer={
        <Footer
          step={step}
          maxStep={maxStep}
          canNext={canNext}
          onPrev={prev}
          onNext={next}
          onClose={close}
          onSubmit={handleSubmit}
        />
      }
    >
      {step === 0 && <StepService data={form} onChange={setForm} />}
      {step === 1 && <StepDescription data={form} onChange={setForm} />}
      {step === 2 && <StepDate data={form} onChange={setForm} />}
    </ModalShell>
  );
}
