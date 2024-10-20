import {
  User,
  UserStatus,
  UserNotificationSetting,
} from '../components/models';

export const usersMock: User[] = [
  {
    id: '1',
    fullName: 'John Doe',
    nickName: 'johny123',
    email: 'john@example.com',
    passwordHash: '1234',
    status: UserStatus.Active,
    notificationSetting: UserNotificationSetting.Off,
    createdAt: '2024-10-19T13:31:48.632332',
    updatedAt: '2024-10-19T13:31:48.632342',
    deletedAt: '',
  },
  {
    id: '2',
    fullName: 'Freddy Mercury',
    nickName: 'fredthebest',
    email: 'fred@example.com',
    passwordHash: '1234',
    status: UserStatus.Active,
    notificationSetting: UserNotificationSetting.ShowAll,
    createdAt: '2024-10-19T13:31:48.632351',
    updatedAt: '2024-10-19T13:31:48.632355',
    deletedAt: '',
  },
  {
    id: '3',
    fullName: 'Harry Potter',
    nickName: 'expeliarmus7',
    email: 'harry@example.com',
    passwordHash: '1234',
    status: UserStatus.Active,
    notificationSetting: UserNotificationSetting.ShowMentions,
    createdAt: '2024-10-19T13:31:48.632351',
    updatedAt: '2024-10-19T13:31:48.632355',
    deletedAt: '',
  },
  {
    id: '4',
    fullName: 'Cristiano Ronaldo',
    nickName: 'CR7',
    email: 'ronaldo@example.com',
    passwordHash: '1234',
    status: UserStatus.DND,
    notificationSetting: UserNotificationSetting.ShowAll,
    createdAt: '2024-10-19T13:31:48.632363',
    updatedAt: '2024-10-19T13:31:48.632366',
    deletedAt: '',
  },
];
