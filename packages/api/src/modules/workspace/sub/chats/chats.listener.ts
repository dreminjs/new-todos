
import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { ChatsService } from "./chats.service.js";

@Injectable()
export class ChatsListener {

  constructor(private readonly chatsService: ChatsService) {
  }

  @OnEvent("chats.joined")
  handleChatsJoined(event: any) {

  }
}
