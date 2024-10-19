import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Message } from '../components/models';

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

  /**
   * Return
   */
  return {
    // state
    messages,

    //actions
    addMessage,
  };
});

/* 
Controller
*/