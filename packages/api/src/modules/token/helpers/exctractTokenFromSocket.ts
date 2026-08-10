
import { Socket } from "socket.io";

export const extractTokenFromSocket = (socket: Socket): string | undefined => {
  const cookieHeader = socket.handshake.headers.cookie;
  if (!cookieHeader) return undefined;

  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [key, ...rest] = c.trim().split("=");
      return [key, rest.join("=")];
    })
  );

  return cookies["accessToken"];
};
