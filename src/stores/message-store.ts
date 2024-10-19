import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Message } from '../components/models';
import { messagesMock } from 'src/mocks/messagesMock';

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
  function addMessage(newMessage: Message) {
    messages.value.push(newMessage);
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

  /**
   * Return
   */
  return {
    // state
    messages,

    //actions
    addMessage,
    loadMessages,
  };
});

/* 
Controller
*/
