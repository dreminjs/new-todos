import { Outlet } from "react-router";
import { ProfileNavigation } from "../ProfileNavigation/ProfileNavigation";

export const ProfileLayout = () => {
  return (
    <>
      <ProfileNavigation />
      <Outlet />
    </>
  );
};
