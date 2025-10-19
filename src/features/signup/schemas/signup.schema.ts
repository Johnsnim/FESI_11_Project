import { z } from "zod";

export const SignUpSchema = z
  .object({
    email: z.string().email("올바른 이메일을 입력해주세요"),
    password: z.string().min(8, "비밀번호는 최소8자 이상이어야 합니다"),
    confirmPassword: z.string(),
    name: z.string().min(1, "이름을 입력해주세요"),
    companyName: z.string().min(1, "회사명을 입력해주세요"),
  })
.refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "비밀번호가 일치하지 않습니다.",
  });
export type SignUpFormValues = z.infer<typeof SignUpSchema>;
