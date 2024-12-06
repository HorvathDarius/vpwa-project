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

export interface UserChannel {
  userID: number;
  channelID: number;
  kicks: number;
  userRole: UserRole;
  userChannelStatus: UserChannelStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}
