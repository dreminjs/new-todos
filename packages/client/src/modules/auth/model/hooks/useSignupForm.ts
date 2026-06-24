import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { SignUpDto } from "types";
import { signUpSchema } from "types";
export const useSignupForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpDto>({
    resolver: zodResolver(signUpSchema),
  });

  return {
    register,
    handleSubmit,
    errors,
  };
};
