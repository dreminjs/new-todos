import { useEffect } from "react";
import { useSocket } from "../../../../app/model/useSocket";
import { useParams } from "react-router";

export const useConnectWorkspaceTodoGroupRoom = () => {
  const socket = useSocket();
  const { groupId } = useParams();

  useEffect(() => {
    console.log(socket)
    if (!socket || !groupId) return;
    socket.emit("join-group-todos-room", groupId);
  }, [socket, groupId]);
};
