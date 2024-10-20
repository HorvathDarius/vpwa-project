import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Message, UserStatus } from '../components/models';
import { messagesMock } from 'src/mocks/messagesMock';

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
  function addMessage(newMessage: Message) {
    messages.value.push(newMessage);
  }

  function loadMessages(channelID: string) {
    const filteredMessages: Message[] = messagesMock.filter(
      (message) => message.channelID === channelID
    );

    console.log(filteredMessages);

    messages.value = filteredMessages;
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
    getMessages,
    saveActualConversation,
  };
});

/* 
Controller
*/
