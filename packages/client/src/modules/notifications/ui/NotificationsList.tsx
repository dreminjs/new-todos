import { NotificationItem } from "./NotificationsItem";
import { useAcceptInvitation, useRejectInvitation } from "../../workspaces";
import { useGetMyNotifications } from "../api/queries";
import styles from "./Notifications.module.css";
import {
  List,
  AutoSizer,
  InfiniteLoader,
  type ListRowProps,
} from "react-virtualized";

export const NotificationsList = () => {
  const { mutate: acceptInvitation } = useAcceptInvitation();
  const { mutate: rejectInvitation } = useRejectInvitation();
  const { items, isPending, hasNextPage, loadMoreRows, rowCount } =
    useGetMyNotifications();

  if (isPending) return <h3>Loading...</h3>;
  if (!items) return <h3>No notifications</h3>;

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
        <NotificationItem
          notification={el}
          onAcceptInvite={acceptInvitation}
          onRejectInvite={rejectInvitation}
          onAcceptRequest={(workspaceRequestId: string) => {
            throw new Error("Function not implemented.");
          }}
          onRejectRequest={(workspaceRequestId: string) => {
            throw new Error("Function not implemented.");
          }}
        />
      </div>
    );
  };

  return (
    <div className={styles.notificationsList}>
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
                rowHeight={40}
                rowRenderer={rowRenderer}
              />
            )}
          </InfiniteLoader>
        )}
      </AutoSizer>
    </div>
  );
};
