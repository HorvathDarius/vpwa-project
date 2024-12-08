export interface Channel {
  id: number;
  name: string;
  type: ChannelType;
  createdBy: number;
  numberOfUsers: number;
  numberOfMessages: number;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export enum ChannelType {
  Public = 'public',
  Private = 'private',
}
