"use client";

import { useMutation } from "@tanstack/react-query";
import { authService } from "./auth.service";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
  });
};
