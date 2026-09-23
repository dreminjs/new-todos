import { WorkspaceParticipant } from "#generated/client.js";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentWorkspaceParticipant = createParamDecorator(
  (date: keyof WorkspaceParticipant | undefined, ctx: ExecutionContext) => {
    const currentParticipate = ctx.switchToHttp().getRequest().workspaceParticipant
  },
);
