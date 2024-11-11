import { Channel } from 'src/components/models'


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

export interface ApiToken {
  type: 'bearer'
  token: string
  expires_at?: string
  expires_in?: number
}

export interface RegisterData {
  email: string
  fullName: string
  nickName: string
  password: string
  passwordConfirmation: string
}

export interface LoginCredentials {
  email: string
  password: string
  remember: boolean
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
  channels: Channel[];
}