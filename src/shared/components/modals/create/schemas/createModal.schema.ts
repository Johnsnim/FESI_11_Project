import { z } from "zod";
import type { CreateGatheringForm, ServiceType } from "../types";

export const createGatheringSchema = z
  .object({
    service: z.string().trim().min(1, "원하시는 서비스를 선택해주세요"),

    name: z
      .string()
      .trim()
      .min(1, "모임 이름을 입력해주세요")
      .max(60, "모임 이름은 60자 이하여야 합니다"),

    location: z
      .string()
      .trim()
      .min(1, "장소를 선택해주세요")
      .max(60, "장소는 60자 이하여야 합니다"),

    date: z.coerce
      .date()
      .refine((d) => !isNaN(d.getTime()), "모임 날짜 및 시간을 선택해주세요"),

    registrationEnd: z.coerce
      .date()
      .refine(
        (d) => !isNaN(d.getTime()),
        "모집 마감 날짜 및 시간을 선택해주세요",
      ),

    capacity: z.coerce
      .number()
      .int("정원은 정수여야 합니다")
      .positive("정원은 1명 이상이어야 합니다")
      .max(999, "정원은 999명 이하로 입력해주세요"),

    imageFile: z.any().optional().nullable(),
    imagePreviewUrl: z.string().optional().nullable(),
  })
  .refine((d) => d.registrationEnd.getTime() < d.date.getTime(), {
    message: "모집 마감 날짜 및 시간은 모임 날짜 및 시간보다 이전이어야 합니다",
    path: ["registrationEnd"],
  });

export function validateAndBuildPayload(form: CreateGatheringForm) {
  const parsed = createGatheringSchema.safeParse(form);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error };
  }

  const {
    service,
    name,
    location,
    date,
    registrationEnd,
    capacity,
    imageFile,
  } = parsed.data;

  return {
    ok: true as const,
    payload: {
      type: service as ServiceType,
      name,
      location,
      dateTime: date.toISOString(),
      registrationEnd: registrationEnd.toISOString(),
      capacity,
      imageFile: imageFile ?? undefined,
    },
  };
}
