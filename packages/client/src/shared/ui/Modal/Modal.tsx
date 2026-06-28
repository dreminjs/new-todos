import type { FC, ReactNode } from "react";
import {
  CloseButton,
  Dialog,
  Portal,
  Heading,
  Separator,
  Button,
} from "@chakra-ui/react";
import styles from "./Modal.module.css";

interface IModalProps {
  isOpen: boolean;
  children: ReactNode;
  onClose: () => void;
  title?: string;
}

export const Modal: FC<IModalProps> = ({
  isOpen,
  children,
  onClose,
  title,
}) => {
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={onClose}
      placement={"center"}
      motionPreset="slide-in-left"
      lazyMount
    >
      <Portal>
        <Dialog.Backdrop zIndex={5} onClick={onClose} />
        <Dialog.Positioner>
          <Dialog.Content className={styles.contentModal}>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="lg" />
            </Dialog.CloseTrigger>
            {title && (
              <Dialog.Header>
                <Heading size="2xl">{title}</Heading>
              </Dialog.Header>
            )}
            <Separator size="md" />
            <Dialog.Body>{children}</Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
