import { WorkspaceParticipant } from "#generated/client.js";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentWorkspaceParticipant = createParamDecorator(
  (data: keyof WorkspaceParticipant | undefined, ctx: ExecutionContext) => {
    const currentParticipate = ctx
      .switchToHttp()
      .getRequest().workspaceParticipant;

    return data ? currentParticipate[data] : currentParticipate;
  },
);
