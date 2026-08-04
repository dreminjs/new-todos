import { NotificationItem } from "./NotificationsItem";
import { useAcceptInvitation, useRejectInvitation } from "../../workspaces";
import {
  useGetMyNotifications,
  useToggleNotificationRead,
} from "../api/queries";
import styles from "./Notifications.module.css";
import {
  List,
  AutoSizer,
  InfiniteLoader,
  type ListRowProps,
} from "react-virtualized";

const GAP = 8;
const ITEM_HEIGHT = 42;

export const NotificationsList = () => {
  const { mutate: acceptInvitation } = useAcceptInvitation();
  const { mutate: rejectInvitation } = useRejectInvitation();
  const { mutate: toggleRead } = useToggleNotificationRead();
  const {
    items,
    isPending: notificationIsPending,
    hasNextPage,
    loadMoreRows,
    rowCount,
  } = useGetMyNotifications();

  const isRowLoaded = ({ index }: { index: number }) =>
    !hasNextPage || index < items.length;

  const rowRenderer = ({ index, key, style }: ListRowProps) => {
    if (!isRowLoaded({ index })) {
      return (
        <div key={key} style={style}>
          Loading...
        </div>
      );
    }

    const el = items[index];
    return (
      <div key={key} style={style}>
        <div
          style={{
            height: ITEM_HEIGHT,
            paddingBottom: GAP,
            boxSizing: "border-box",
          }}
        >
          <NotificationItem
            notification={el}
            onAcceptInvite={acceptInvitation}
            onRejectInvite={rejectInvitation}
            onToggleRead={toggleRead}
            onAcceptRequest={(workspaceRequestId: string) => {
              throw new Error("Function not implemented.");
            }}
            onRejectRequest={(workspaceRequestId: string) => {
              throw new Error("Function not implemented.");
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={styles.notificationsList}>
      {notificationIsPending && <h3>Loading...</h3>}
      {!items.length && <h3>No notifications</h3>}
      <AutoSizer>
        {({ width, height }) => (
          <InfiniteLoader
            isRowLoaded={isRowLoaded}
            loadMoreRows={loadMoreRows}
            rowCount={rowCount}
          >
            {({ onRowsRendered, registerChild }) => (
              <List
                ref={registerChild}
                onRowsRendered={onRowsRendered}
                width={width}
                height={height}
                rowCount={rowCount}
                rowHeight={ITEM_HEIGHT + GAP}
                rowRenderer={rowRenderer}
              />
            )}
          </InfiniteLoader>
        )}
      </AutoSizer>
    </div>
  );
};
