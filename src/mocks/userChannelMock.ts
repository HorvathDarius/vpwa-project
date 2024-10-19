enum UserRole {
  Admin = 'admin',
  Member = 'member',
}

enum UserChannelStatus {
  PendingInvite = 'pending_invite',
  InChannel = 'in_channel',
  LeftChannel = 'left_channel',
  KickedOut = 'kicked_out',
}

interface UserChannel {
  userID: string;
  channelID: string;
  userRole: UserRole;
  userChannelStatus: UserChannelStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export const userChannelsMock: UserChannel[] = [
  {
    userID: '1',
    channelID: '1',
    userRole: UserRole.Admin,
    userChannelStatus: UserChannelStatus.InChannel,
    createdAt: '2024-10-19T13:39:36.295813',
    updatedAt: '2024-10-19T13:39:36.295820',
    deletedAt: '',
  },
  {
    userID: '1',
    channelID: '2',
    userRole: UserRole.Member,
    userChannelStatus: UserChannelStatus.InChannel,
    createdAt: '2024-10-19T13:39:36.295813',
    updatedAt: '2024-10-19T13:39:36.295820',
    deletedAt: '',
  },
  {
    userID: '1',
    channelID: '3',
    userRole: UserRole.Member,
    userChannelStatus: UserChannelStatus.LeftChannel,
    createdAt: '2024-10-19T13:39:36.295813',
    updatedAt: '2024-10-19T13:39:36.295820',
    deletedAt: '',
  },
  {
    userID: '2',
    channelID: '3',
    userRole: UserRole.Member,
    userChannelStatus: UserChannelStatus.InChannel,
    createdAt: '2024-10-19T13:39:36.295826',
    updatedAt: '2024-10-19T13:39:36.295828',
    deletedAt: '',
  },
  {
    userID: '2',
    channelID: '1',
    userRole: UserRole.Member,
    userChannelStatus: UserChannelStatus.InChannel,
    createdAt: '2024-10-19T13:39:36.295832',
    updatedAt: '2024-10-19T13:39:36.295834',
    deletedAt: '',
  },
  {
    userID: '2',
    channelID: '3',
    userRole: UserRole.Member,
    userChannelStatus: UserChannelStatus.InChannel,
    createdAt: '2024-10-19T13:39:36.295832',
    updatedAt: '2024-10-19T13:39:36.295834',
    deletedAt: '',
  },
  {
    userID: '3',
    channelID: '2',
    userRole: UserRole.Admin,
    userChannelStatus: UserChannelStatus.InChannel,
    createdAt: '2024-10-19T13:39:36.295838',
    updatedAt: '2024-10-19T13:39:36.295840',
    deletedAt: '',
  },
  {
    userID: '3',
    channelID: '3',
    userRole: UserRole.Member,
    userChannelStatus: UserChannelStatus.InChannel,
    createdAt: '2024-10-19T13:39:36.295844',
    updatedAt: '2024-10-19T13:39:36.295846',
    deletedAt: '',
  },
  {
    userID: '4',
    channelID: '1',
    userRole: UserRole.Member,
    userChannelStatus: UserChannelStatus.InChannel,
    createdAt: '2024-10-19T13:39:36.295838',
    updatedAt: '2024-10-19T13:39:36.295840',
    deletedAt: '',
  },
  {
    userID: '4',
    channelID: '2',
    userRole: UserRole.Member,
    userChannelStatus: UserChannelStatus.KickedOut,
    createdAt: '2024-10-19T13:39:36.295844',
    updatedAt: '2024-10-19T13:39:36.295846',
    deletedAt: '',
  },
  {
    userID: '4',
    channelID: '3',
    userRole: UserRole.Admin,
    userChannelStatus: UserChannelStatus.InChannel,
    createdAt: '2024-10-19T13:39:36.295838',
    updatedAt: '2024-10-19T13:39:36.295840',
    deletedAt: '',
  },
];