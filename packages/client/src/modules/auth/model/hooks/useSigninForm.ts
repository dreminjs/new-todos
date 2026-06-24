import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { AuthDto } from "types";
import { authSchema } from "types";
export const useSigninForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthDto>({
    resolver: zodResolver(authSchema),
  });

  return {
    register,
    handleSubmit,
    errors,
  };
};
