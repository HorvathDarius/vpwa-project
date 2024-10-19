import { ref } from 'vue';
import { defineStore } from 'pinia';
import {
  Channel,
  User,
  UserChannel,
  UserChannelStatus,
  UserRole,
} from '../components/models';
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
  const allChannels = ref<Channel[]>(channelsMock);
  const userChannelRecords = ref<UserChannel[]>(userChannelsMock);
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
  function getChannel(channelName: string) {
    console.log(channelName);
    const foundChannel = allChannels.value.filter(
      (channel) => channel.name === channelName
    );

    if (foundChannel.length) {
      console.log('CHANNEL FOUND - ' + foundChannel[0]);
      return foundChannel[0];
    } else {
      console.log('CHANNEL NOT FOUND - ' + foundChannel[0]);
      return null;
    }
  }
  function addChannel(channel: Channel) {
    const channelId = getHighestChannelID(allChannels.value) + 1;
    console.log('NEXT ID - ' + channelId);
    channel.id = channelId.toString();
    console.log('NEXT ID - ' + channel);
    availableChannels.value.push(channel);
    setCurrentActiveChannel(channel);
  }
  function cancelChannel(channelID: string | undefined) {
    availableChannels.value = availableChannels.value.filter(
      (channel) => channel.id !== channelID
    );
  }
  function addMember(newUser: User, channel: Channel) {
    userChannelRecords.value.push({
      userID: newUser.id,
      channelID: channel.id,
      userRole: UserRole.Member,
      userChannelStatus: UserChannelStatus.InChannel,
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
      deletedAt: '',
    });
    setCurrentActiveChannel(channel);
    currentChannelMembers.value.push(newUser);
    loadChannels(newUser.id, userChannelRecords.value);
  }
  function removeMember(userID: string | undefined) {
    currentChannelMembers.value = currentChannelMembers.value.filter(
      (user) => user.id !== userID
    );

    const removedUserChannelRecord = userChannelRecords.value.find(
      (record) =>
        record.userID === userID &&
        record.channelID === currentActiveChannel.value?.id
    );

    const newUserChannelRecord = userChannelRecords.value.filter(
      (record) => record !== removedUserChannelRecord
    );

    loadChannels(userID, newUserChannelRecord);
  }
  function loadChannels(
    userID: string | undefined,
    userChannelRecord: UserChannel[] = userChannelsMock
  ) {
    const userChannelIds = userChannelRecord
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
    getChannel,
    addChannel,
    cancelChannel,
    addMember,
    removeMember,
    loadChannels,
    setCurrentActiveChannel,
  };
});

/* 
Controller
*/

// only helper for 1st assignment
const getHighestChannelID = (channels: Channel[]): number => {
  return Math.max(...channels.map((channel) => parseInt(channel.id, 10)));
};
