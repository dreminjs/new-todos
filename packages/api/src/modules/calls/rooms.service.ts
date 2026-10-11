import { Injectable } from "@nestjs/common";
import { Peer, Room, TCallId } from "./calls.interfaces.js";
import { MediasoupService } from "./mediasoup.service.js";
import { NotFoundError } from "../../classes/app.error.js";

@Injectable()
export class RoomsService {
  private rooms = new Map<TCallId, Room>();

  constructor(private readonly mediasoupService: MediasoupService) {}

  async getOrCreateRoom(callId: string): Promise<Room> {
    let room = this.rooms.get(callId);
    if (room) return room;

    const router = await this.mediasoupService
      .getWorker()
      .createRouter({ mediaCodecs: this.mediasoupService.mediaCodecs });

    room = { router, peers: new Map() };
    this.rooms.set(callId, room);
    return room;
  }

  addPeer(callId: string, socketId: string, userId: string) {
    const room = this.rooms.get(callId);
    const peer: Peer = {
      socketId,
      userId,
      transports: new Map(),
      producers: new Map(),
      consumers: new Map(),
    };
    if (!room) return new NotFoundError("No room");

    room.peers.set(socketId, peer);
    return peer;
  }

  getPeer(callId: string, socketId: string): Peer | undefined {
    return this.rooms.get(callId)?.peers.get(socketId);
  }

  getRoom(callId: string): Room | undefined {
    return this.rooms.get(callId);
  }

  getOtherProducers(callId: string, excludeSocketId: string) {
    const room = this.rooms.get(callId);
    const result: { socketId: string; producerId: string }[] = [];

    if (!room) return new NotFoundError("No room Found");

    for (const [socketId, peer] of room.peers) {
      if (socketId === excludeSocketId) continue;
      for (const producer of peer.producers.values()) {
        result.push({ socketId, producerId: producer.id });
      }
    }
    return result;
  }

  removePeer(callId: string, socketId: string) {
    const room = this.rooms.get(callId);
    if (!room) return;

    const peer = room.peers.get(socketId);
    if (!peer) return;

    peer.transports.forEach((t) => {
      t.close();
    });
    room.peers.delete(socketId);

    if (room.peers.size === 0) {
      room.router.close();
      this.rooms.delete(callId);
    }
  }
}
