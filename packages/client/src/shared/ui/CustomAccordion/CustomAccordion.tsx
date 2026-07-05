import { Accordion } from "@chakra-ui/react";
import type { FC } from "react";
import styles from "./CustomAccordion.module.css";

interface ICustomAccordionProps {
  header: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const CustomAccordion: FC<ICustomAccordionProps> = ({
  header,
  children,
  defaultOpen,
}) => {
  return (
    <Accordion.Root collapsible defaultValue={defaultOpen ? ["accordion"] : []}>
      <Accordion.Item value="accordion">
        <Accordion.ItemTrigger className={styles.accordionTrigger}>
          {header}
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <>{children}</>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};
