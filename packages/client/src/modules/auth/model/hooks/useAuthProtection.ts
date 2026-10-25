import { useEffect } from "react";
import { useGetMe } from "../../../users";
import { useLocation, useNavigate } from "react-router";
import { PUBLIC_AUTH_PATHS } from "../../../../shared/model/auth.constants";

type UseAuthProtectionProps =
  | { forPublicOnly: true; forAuthOnly?: false }
  | { forAuthOnly: true; forPublicOnly?: false };


export const useAuthProtection = (props: UseAuthProtectionProps) => {
  const { data: userId, isLoading } = useGetMe("id");
  const navigate = useNavigate();

  const { pathname } = useLocation();

  useEffect(() => {
    console.log(pathname);
    if (isLoading) return;

    const forPublicOnly = props.forPublicOnly;
    const forAuthOnly = props.forAuthOnly;

    if (forPublicOnly && userId) {
      navigate("/home");
    } else if (forAuthOnly && !userId) {
      if (!PUBLIC_AUTH_PATHS.includes(pathname)) {
        navigate("/auth/signin");
      }
    }
  }, [
    userId,
    isLoading,
    navigate,
    props.forPublicOnly,
    props.forAuthOnly,
    pathname,
  ]);

  return { isLoading };
};
