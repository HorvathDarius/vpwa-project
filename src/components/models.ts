/**
 * Enums
 */
export enum ChannelType {
  Public = 'public',
  Private = 'private',
}

export enum UserStatus {
  Active = 'Active',
  Offline = 'Offline',
  DND = 'Do not disturb',
}

export enum UserNotificationSetting {
  ShowAll = 'all',
  ShowMentions = 'mentionsOnly',
  Off = 'off',
}

export enum UserRole {
  Admin = 'admin',
  Member = 'member',
}

export enum UserChannelStatus {
  PendingInvite = 'pending_invite',
  InChannel = 'in_channel',
  LeftChannel = 'left_channel',
  KickedOut = 'kicked_out',
}

/**
 * Interfaces
 */
export interface Channel {
  id: string; // uuid
  name: string;
  type: ChannelType;
  createdBy: string;
  numberOfUsers: number;
  numberOfMessages: number;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface User {
  id: string; // uuid
  fullName: string;
  nickName: string;
  email: string;
  passwordHash: string; // idk if we should put this here?
  status: UserStatus;
  notificationSetting: UserNotificationSetting;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface UserChannel {
  userID: string;
  channelID: string;
  kicks: number;
  userRole: UserRole;
  userChannelStatus: UserChannelStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface Message {
  id: string; // uuid
  userID: string; // uuid
  channelID: string; // uuid
  content: string;
  status: string; // idk if we put it here, not in requirements
  sentAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}
