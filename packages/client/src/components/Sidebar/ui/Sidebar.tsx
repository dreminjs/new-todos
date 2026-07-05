import { Box, Drawer, useMediaQuery } from "@chakra-ui/react";
import { SidebarContent } from "./SidebarContent";
import styles from "./Sidebar.module.css";

export const Sidebar = () => {
  const [isDesktop] = useMediaQuery(["(min-width: 1550px)"]);

  if (isDesktop) {
    return (
      <Box
        className={styles.sidebar}
        as="aside"
        width="340px"
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
