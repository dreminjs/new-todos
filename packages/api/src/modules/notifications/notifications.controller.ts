import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import { NotificationsService } from "./notifications.service.js";
import { CurrentUser } from "../user/decorators/user.decorator.js";
import { AccessTokenGuard } from "../token/guards/accees-token.guard.js";
import { IItemsResponse, TNotification } from "types";
import { GetNotificationsQuery } from "./dto/notifactions.dto.js";
@UseGuards(AccessTokenGuard)
@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get("my")
  async findMy(
    @CurrentUser("id") currentUserId: string,
    @Query() query: GetNotificationsQuery,
  ): Promise<IItemsResponse<TNotification>> {
    return await this.notificationsService.findMy(currentUserId, query);
  }

  @Patch(":id/read")
  async read(@Param("id") id: string): Promise<TNotification> {
    return await this.notificationsService.readOneById(id);
  }

  @Patch(":id/unread")
  async unread(@Param("id") id: string): Promise<TNotification> {
    return await this.notificationsService.unreadOneById(id);
  }
}
