import { Message } from '../components/models';

export const messagesMock: Message[] = [
  {
    id: '1',
    userID: '1',
    channelID: '1',
    content: 'Hello, this is message 1!',
    status: 'sent',
    sentAt: '2024-10-15T12:30:00Z',
    createdAt: '2024-10-15T12:30:00Z',
    updatedAt: '2024-10-15T12:31:00Z',
    deletedAt: '',
  },
  {
    id: '2',
    userID: '2',
    channelID: '1',
    content: 'This is message 2!',
    status: 'sent',
    sentAt: '2024-10-15T13:00:00Z',
    createdAt: '2024-10-15T13:00:00Z',
    updatedAt: '2024-10-15T13:01:00Z',
    deletedAt: '',
  },
  {
    id: '3',
    userID: '1',
    channelID: '2',
    content: 'Another message here!',
    status: 'sent',
    sentAt: '2024-10-15T14:00:00Z',
    createdAt: '2024-10-15T14:00:00Z',
    updatedAt: '2024-10-15T14:01:00Z',
    deletedAt: '',
  },
];
