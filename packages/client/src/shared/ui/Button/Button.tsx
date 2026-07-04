import {
  Button as ChakraButton,
  type ButtonProps as ChakraButtonProps,
} from "@chakra-ui/react";
import type { FC } from "react";

type TButtonVariant = "primary" | "secondary";

type TButtonProps = Omit<ChakraButtonProps, "variant"> & {
  variant?: TButtonVariant;
};

const variantStyles: Record<TButtonVariant, ChakraButtonProps["css"]> = {
  primary: {
    color: "white",
    backgroundColor: "blue.500",
    padding: "8px 16px",
    fontSize: "16px",
  },
  secondary: {
    color: "black",
    border: "1px solid",
    borderColor: "gray.500",
    backgroundColor: "gray.50",
    padding: "8px 16px",
    fontSize: "16px",
  },
};

export const Button: FC<TButtonProps> = ({ variant = "primary", ...props }) => {
  return <ChakraButton css={variantStyles[variant]} {...props} />;
};
