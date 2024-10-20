import { defineStore } from 'pinia';
import { ref } from 'vue';
import { date } from 'quasar';
import { Message, User, UserChannelStatus } from '../components/models';
import { messagesMock } from 'src/mocks/messagesMock';
import { mentionsMock } from 'src/mocks/mentionsMock';
import { userChannelsMock } from 'src/mocks/userChannelMock';
import { usersMock } from 'src/mocks/usersMock';

/* 
Store
*/
export const useMessageStore = defineStore('messages', () => {
  /**
   * State
   */
  const messages = ref<Message[]>([]);

  /**
   * Getters
   */

  /**
   * Actions
   */
  function addMessage(
    userID: string,
    channelID: string,
    content: string,
    status: string
  ) {
    const timeStamp = Date.now();
    const newMessage: Message = {
      id: (getHighestMessageID(messagesMock) + 1).toString(),
      userID: userID,
      channelID: channelID,
      content: content,
      status: status,
      sentAt: date.formatDate(timeStamp, 'HH:mm'),
      createdAt: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm'),
      updatedAt: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm'),
      deletedAt: '',
    };
    findMentionsInMessage(newMessage);
    messages.value.push(newMessage);
    messagesMock.push(newMessage);
    // console.table(newMessage);
    // console.table(messagesMock);
  }

  function loadMessages(channelID: string) {
    console.log('Loading messages for channel:', channelID);
    console.log('Messages:', messagesMock);

    const filteredMessages: Message[] = messagesMock.filter(
      (message) => message.channelID === channelID
    );

    console.log(filteredMessages);

    messages.value = filteredMessages;
  }

  function isUserMentioned(userID: string, messageID: string): boolean {
    // endpoint call
    return mentionsMock.some(
      (mention) => mention.userID === userID && mention.messageID === messageID
    );
  }

  /**
   * Return
   */
  return {
    // state
    messages,

    //actions
    addMessage,
    loadMessages,
    isUserMentioned,
  };
});

/* 
Controller
*/
const findMentionsInMessage = (message: Message): string[] => {
  const mentionedUsersIDs: string[] = [];

  // Iterate through all users and check if their nickname is mentioned
  usersMock.forEach((user: User) => {
    const mentionPattern = new RegExp(`@${user.nickName}\\b`, 'g'); // Match @username followed by word boundary
    if (
      mentionPattern.test(message.content) &&
      userChannelsMock.some(
        (item) =>
          item.userID == user.id && // user is in the channel
          item.channelID === message.channelID &&
          item.userChannelStatus === UserChannelStatus.InChannel
      )
    ) {
      mentionedUsersIDs.push(user.id);
    }
  });

  mentionedUsersIDs.forEach((id: string) => {
    mentionsMock.push({ userID: id, messageID: message.id });
  });
  return mentionedUsersIDs;
};

// only helper for 1st assignment
const getHighestMessageID = (messages: Message[]): number => {
  return Math.max(...messages.map((message) => parseInt(message.id, 10)));
};
