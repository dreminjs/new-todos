import { Spinner } from "@chakra-ui/react";

export const GlobalLoadingSpinner = () => {
  return (
    <Spinner
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translateX(-50%) translateY(-50%)",
      }}
    />
  );
};
