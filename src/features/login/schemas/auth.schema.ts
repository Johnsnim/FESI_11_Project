import { z } from "zod";

export const LogInSchema = z.object({
  email: z.string().email("이메일 형식이 아닙니다"),
  password: z
    .string()
    .min(8, "비밀번호는 최소 8자리 이상이어야 합니다")
    .regex(
      /^[^\u3131-\u318E\uAC00-\uD7A3]+$/,
      "비밀번호에 한글을 포함할 수 없습니다"
    )
});

export type LogInFormValues = z.infer<typeof LogInSchema>;
