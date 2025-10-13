import { z } from "zod";

export const EditUserSchema = z.object({
  name: z.string().min(1, "이름은 필수입니다"),
  email: z.string().email("올바른 이메일을 입력해주세요"),
  companyName: z.string().min(1, "회사명은 필수입니다"),
  image: z.union([z.string().url(), z.instanceof(File)]).optional(),
});

export type EditUserFormValues = z.infer<typeof EditUserSchema>;