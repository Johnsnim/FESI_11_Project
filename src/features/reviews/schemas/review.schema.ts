import { z } from "zod";

export const CreateReviewSchema = z.object({
  score: z.number().min(1).max(5),
  comment: z
    .string()
    .min(1, "리뷰 내용을 입력해주세요")
    .max(500, "리뷰는 최대 500자까지 입력 가능합니다"),
  gatheringId: z.number().int().positive(),
});

export type CreateReviewFormValues = z.infer<typeof CreateReviewSchema>;
