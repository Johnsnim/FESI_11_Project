import z from "zod";

export const EditUserSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"), // 디폴트때문에 우선 명시해놓음 혹시 추후 api수정되면 사용
  email: z.string().email("올바른 이메일을 입력해주세요"),// 마찬가지
  companyName: z.string().min(1, "회사명을 입력해주세요"),
  image: z.file().optional(),
});
export type EditUserFormValues = z.infer<typeof EditUserSchema>;
