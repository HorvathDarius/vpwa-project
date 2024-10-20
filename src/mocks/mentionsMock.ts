// User with userID was mentioned in message with messageID

interface Mention {
  userID: string;
  messageID: string;
}

export const mentionsMock: Mention[] = [
  {
    userID: '1',
    messageID: '2',
  },
  {
    userID: '3',
    messageID: '2',
  },
  {
    userID: '1',
    messageID: '3',
  },
];
