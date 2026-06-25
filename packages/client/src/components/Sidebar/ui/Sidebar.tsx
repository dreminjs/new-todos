import { Box, Drawer, useBreakpointValue } from "@chakra-ui/react";
import { SidebarContent } from "./SidebarContent";
import styles from "./Sidebar.module.css";

export const Sidebar = () => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  if (isDesktop) {
    return (
      <Box
        className={styles.sidebar}
        as="aside"
        width="320px"
        minH="100vh"
        borderRightWidth="1px"
        p={4}
      >
        <SidebarContent />
      </Box>
    );
  }

  return (
    <Drawer.Root placement={"start"}>
      <Drawer.Positioner>
        <Drawer.Content className={styles.sidebar}>
          <Drawer.Header>
            <Drawer.Title />
          </Drawer.Header>
          <Drawer.Body>
            <SidebarContent />
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};
