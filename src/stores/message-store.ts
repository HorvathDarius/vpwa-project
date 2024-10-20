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
    console.log('Loading messages for channel:', channelID);
    console.log('Messages:', messagesMock);

    const filteredMessages: Message[] = messagesMock.filter(
      (message) => message.channelID === channelID
    );

    console.log(filteredMessages);

    messages.value = filteredMessages;
  }
  function loadPartOfMessages(startIndex: number, endIndex: number) {
    console.log('Loading part of messages');
    console.log('Start index:', startIndex);
    console.log('End index:', endIndex);
    console.log('Length:', messages.value.length);
    console.log('Limit:', messages.value.length - endIndex);

    let maxIndex = messages.value.length - startIndex - 1;
    const downLimit = messages.value.length - endIndex;

    for (; maxIndex > downLimit; maxIndex--) {
      displayedMessages.value.push(messages.value[maxIndex]);
      console.log(maxIndex);
    }
    console.log('Displayed messages:');
    console.log(displayedMessages.value);
    return displayedMessages.value;
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
    loadPartOfMessages,
  };
});

/* 
Controller
*/
