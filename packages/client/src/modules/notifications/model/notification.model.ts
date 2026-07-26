import type { TNotification } from "types";

export type NotificationType = 'invitation' | 'request' | 'plain';

export interface BaseNotification {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface InvitationNotification extends TNotification {
  type: 'invitation';
  workspaceInvitationId: string;
}

export interface RequestNotification extends TNotification {
  type: 'request';
  workspaceRequestId: string;
}

export interface PlainNotification extends TNotification {
  type: 'plain';
}

export type Notification = InvitationNotification | RequestNotification | PlainNotification;

export const isInvitation = (n: TNotification): n is InvitationNotification =>
  n.workspaceInvitationId !== null;

export const isRequest = (n: Notification): n is RequestNotification =>
  n.workspaceRequestId !== null;
