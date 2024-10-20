import { defineStore } from 'pinia';
import { ref } from 'vue';
import { date } from 'quasar';
import {
  Message,
  User,
  UserChannelStatus,
  UserStatus,
} from '../components/models';
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
  const displayedMessages = ref<Message[]>([]);

  /**
   * Getters
   */

  /**
   * Actions
   */
  // Function to add a message
  function addMessage(
    userID: string,
    channelID: string,
    content: string,
    status: string
  ) {
    const timeStamp = Date.now();
    // Create new message
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
  }

  // Load messages for a given channel
  function loadMessages(channelID: string) {
    // Filter messages by channelID
    const filteredMessages: Message[] = messagesMock.filter(
      (message) => message.channelID === channelID
    );

    // Set the messages for the channel
    messages.value = filteredMessages;
  }

  // Function to check if a user is mentioned in a message
  function isUserMentioned(userID: string, messageID: string): boolean {
    // endpoint call
    return mentionsMock.some(
      (mention) => mention.userID === userID && mention.messageID === messageID
    );
  }

  // Function used to return visible messages
  function getMessages(userStatus: UserStatus) {
    // If user is online, return all messages
    if (userStatus !== UserStatus.Offline) {
      return messages.value;
      // Else return a saved conversation from function saveActualConversation()
    } else {
      return displayedMessages.value;
    }
  }

  // This function is called whenever a user changes status
  function saveActualConversation(status: UserStatus) {
    // for when he goes offline, save a snapshot of the current convo
    if (status === UserStatus.Offline) {
      messages.value.forEach((message) =>
        displayedMessages.value.push(message)
      );
    }
  }

  /**
   * Return
   */
  return {
    // state
    messages,
    displayedMessages,

    //actions
    addMessage,
    loadMessages,
    isUserMentioned,
    getMessages,
    saveActualConversation,
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
