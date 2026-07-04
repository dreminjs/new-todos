import { Button } from "../..";
import type { FC } from "react";
import clsx from "clsx";
import styles from "./FormBottom.module.css";

interface IFormBottomProps {
  onClose: () => void;
  isLoading: boolean;
  className?: string;
}

export const FormBottom: FC<IFormBottomProps> = ({
  onClose,
  isLoading,
  className,
}) => {
  return (
    <div className={clsx(styles.todoFormBottom, className)}>
      <Button variant="primary" type="submit" disabled={isLoading}>
        {isLoading ? "Loading..." : "Submit"}
      </Button>
      <Button
        variant="secondary"
        onClick={onClose}
        type="button"
        disabled={isLoading}
      >
        Close
      </Button>
    </div>
  );
};
