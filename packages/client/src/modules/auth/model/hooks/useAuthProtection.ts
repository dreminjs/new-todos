import { useEffect } from "react";
import { useGetMe } from "../../../users";
import { useNavigate } from "react-router";

type UseAuthProtectionProps =
  | { forPublicOnly: true; forAuthOnly?: false }
  | { forAuthOnly: true; forPublicOnly?: false };

export const useAuthProtection = (props: UseAuthProtectionProps) => {
  const { data: userId, isLoading } = useGetMe("id");
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    const forPublicOnly = props.forPublicOnly;
    const forAuthOnly = props.forAuthOnly;

    if (forPublicOnly && userId) {
      navigate("/home");
    } else if (forAuthOnly && !userId) {
      navigate("/auth/signin");
    }
  }, [userId, isLoading, navigate, props.forPublicOnly, props.forAuthOnly]);

  return { isLoading };
};
