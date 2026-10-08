import type {
  Router,
  WebRtcTransport,
  Producer,
  Consumer,
} from "mediasoup/types";

export interface Peer {
  socketId: string;
  userId: string;
  transports: Map<string, WebRtcTransport>;
  producers: Map<string, Producer>;
  consumers: Map<string, Consumer>;
}

export interface Room {
  router: Router;
  peers: Map<string, Peer>;
}


export interface IStartCall {
  callId: string;
  chatId: string;
  workspaceId: string;
  initiatorId: string;
}
