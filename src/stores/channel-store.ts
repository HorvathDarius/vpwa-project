import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Channel, User } from '../components/models';

/* 
Store
*/
export const useChannelStore = defineStore('channels', () => {
  /**
   * State
   */
  const availableChannels = ref<Channel[]>([]);
  const currentChannelMembers = ref<User[]>([]);

  /**
   * Getters
   */

  /**
   * Actions
   */
  function addChannel(channel: Channel) {
    availableChannels.value.push(channel);
  }
  function addMember(newUser: User) {
    currentChannelMembers.value.push(newUser);
  }
  function loadChannels(userID: string) {
    availableChannels.value = [];
  }
  function loadCurrentChannelMembers(channelID: string) {
    currentChannelMembers.value = [];
  }

  /**
   * Return
   */
  return {
    // state
    availableChannels,
    currentChannelMembers,

    // actions
    addChannel,
    addMember,
    loadChannels,
  };
});

/* 
Controller
*/
