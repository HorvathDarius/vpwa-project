import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Channel, User, UserChannelStatus } from '../components/models';
import { channelsMock } from '../mocks/channelsMock';
import { userChannelsMock } from 'src/mocks/userChannelMock';
import { usersMock } from 'src/mocks/usersMock';
import { useMessageStore } from './message-store';

/* 
Store
*/
export const useChannelStore = defineStore('channels', () => {
  /**
   * State
   */
  // const availableChannels = ref<Channel[]>([]);
  const availableChannels = ref<Channel[]>(channelsMock);
  const currentChannelMembers = ref<User[]>([]);
  const currentActiveChannel = ref<Channel | null>(null);
  const messageStore = useMessageStore();

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
    const userChannelIds = userChannelsMock
      .filter(
        (item) =>
          item.userID === userID &&
          item.userChannelStatus !== UserChannelStatus.KickedOut
      ) // Filter for the user and ensure they are in the channel
      .map((item) => item.channelID); // Extract channel IDs

    // Step 2: Filter available channels based on the channel IDs
    availableChannels.value = channelsMock.filter((channel) =>
      userChannelIds.includes(channel.id)
    );
  }

  function loadCurrentChannelMembers(channelID: string) {
    const filteredChannels = userChannelsMock.filter(
      (channel) => channel.channelID === channelID
    );

    const memberIDs = filteredChannels.map((channel) => channel.userID);
    const uniqueIds: string[] = [];

    memberIDs.forEach((id) => {
      if (!uniqueIds.includes(id)) {
        uniqueIds.push(id);
      }
    });

    const memebers = usersMock.filter((user) => uniqueIds.includes(user.id));

    currentChannelMembers.value = memebers;
  }

  function setCurrentActiveChannel(channel: Channel) {
    currentActiveChannel.value = channel;
    loadCurrentChannelMembers(channel.id);
    messageStore.loadMessages(channel.id);
  }

  /**
   * Return
   */
  return {
    // state
    availableChannels,
    currentChannelMembers,
    currentActiveChannel,

    // actions
    addChannel,
    addMember,
    loadChannels,
    setCurrentActiveChannel,
  };
});

/* 
Controller
*/
