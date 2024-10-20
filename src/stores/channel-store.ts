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
import { useNotifications } from 'src/utils/useNotifications';

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
  const pendingChannels = ref<Channel[]>([]);
  const currentChannelMembers = ref<User[]>([]);
  const currentActiveChannel = ref<Channel | null>(null);
  const messageStore = useMessageStore();

  /**
   * Getters
   */

  /**
   * Actions
   */
  function getChannelById(channelID: string) {
    console.log(channelID);
    return allChannels.value.find((channel) => channel.id === channelID);
  }

  function getChannelByName(channelName: string) {
    console.log(channelName);
    return allChannels.value.find((channel) => channel.name === channelName);
  }

  function addChannel(channel: Channel, user: User) {
    const channelId = getHighestChannelID(allChannels.value) + 1;
    console.log('NEXT ID - ' + channelId);
    channel.id = channelId.toString();
    console.log('NEXT ID - ' + channel);
    availableChannels.value.push(channel);
    setCurrentActiveChannel(channel);
    inviteMember(user);
  }

  function cancelChannel(channelID: string | undefined) {
    allChannels.value = allChannels.value.filter(
      (channel) => channel.id !== channelID
    );
    availableChannels.value = availableChannels.value.filter(
      (channel) => channel.id !== channelID
    );
    userChannelRecords.value = userChannelRecords.value.filter(
      (record) => record.channelID !== channelID
    );
  }

  function inviteMember(user: User) {
    console.log('INVITE MEMBER - ' + user);
    userChannelRecords.value.push({
      userID: user.id,
      channelID: currentActiveChannel.value!.id,
      userRole: UserRole.Member,
      kicks: 0,
      userChannelStatus: UserChannelStatus.PendingInvite,
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
      deletedAt: '',
    });
  }

  function joinChannel(newUser: User, channel: Channel) {
    userChannelRecords.value.push({
      userID: newUser.id,
      channelID: channel.id,
      kicks: 0,
      userRole: UserRole.Member,
      userChannelStatus: UserChannelStatus.InChannel,
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
      deletedAt: '',
    });
    setCurrentActiveChannel(channel);
    loadChannels(newUser.id, userChannelRecords.value);
    loadCurrentChannelMembers(currentActiveChannel.value!.id);
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

  function acceptInvitation(userID: string, channelID: string) {
    console.log('ACCEPTING INVITATION IN STORE');
    const acceptUserChannelRecord = userChannelRecords.value.find(
      (record) => record.userID === userID && record.channelID === channelID
    );
    acceptUserChannelRecord!.userChannelStatus = UserChannelStatus.InChannel;

    console.log(userChannelRecords.value);
    console.log(pendingChannels.value);

    const channel = getChannelById(channelID);

    pendingChannels.value.splice(pendingChannels.value.indexOf(channel!), 1);

    console.log(userChannelRecords.value);
    console.log(pendingChannels.value);

    setCurrentActiveChannel(channel!);
    loadChannels(userID, userChannelRecords.value);
    loadCurrentChannelMembers(currentActiveChannel.value!.id);
  }

  function declineInvitation(userID: string, channelID: string) {
    console.log('DECLINING INVITATION IN STORE');
    const removedUserChannelRecord = userChannelRecords.value.find(
      (record) => record.userID === userID && record.channelID === channelID
    );
    const indexOfRemovedRecord = userChannelRecords.value.indexOf(
      removedUserChannelRecord!
    );
    userChannelRecords.value.splice(indexOfRemovedRecord, 1);
    loadChannels(userID, userChannelRecords.value);
  }

  function loadChannels(
    userID: string | undefined,
    userChannelRecord: UserChannel[] = userChannelsMock
  ) {
    const userChannelIds = userChannelRecord
      .filter(
        (item) =>
          item.userID === userID &&
          item.userChannelStatus !== UserChannelStatus.KickedOut &&
          item.userChannelStatus !== UserChannelStatus.PendingInvite
      ) // Filter for the user and ensure they are in the channel
      .map((item) => item.channelID); // Extract channel IDs

    console.log(userChannelRecords.value);

    // Also find pending invites
    pendingChannels.value = loadPendingChannels(userID, userChannelRecord);

    // Step 2: Filter available channels based on the channel IDs
    availableChannels.value = channelsMock.filter((channel) =>
      userChannelIds.includes(channel.id)
    );

    availableChannels.value = [
      ...pendingChannels.value,
      ...availableChannels.value,
    ];
  }

  function loadPendingChannels(
    userID: string | undefined,
    userChannelRecord: UserChannel[] = userChannelsMock
  ) {
    const userChannelIds = userChannelRecord
      .filter(
        (item) =>
          item.userID === userID &&
          item.userChannelStatus === UserChannelStatus.PendingInvite
      ) // Filter for the user to be in a pending invite
      .map((item) => item.channelID); // Extract channel IDs

    // Step 2: return the filtered items
    return channelsMock.filter((channel) =>
      userChannelIds.includes(channel.id)
    );
  }

  function kickMemberFromChannel(
    userID: string,
    channelID: string,
    userName: string
  ) {
    const record = loadUserChannelRecords(userID, channelID);
    record!.kicks++;

    useNotifications('info', `${userName} has ${record!.kicks} kicks`);

    if (record!.kicks == 3) {
      record!.userChannelStatus = UserChannelStatus.KickedOut;
      removeMember(userID);
      useNotifications(
        'info',
        `${userName} has been kicked out of the channel`
      );
    }
  }

  function loadUserChannelRecords(userID: string, channelID: string) {
    return userChannelRecords.value.find(
      (record) => record.channelID === channelID && record.userID === userID
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

  function checkChannelsInactive() {
    console.log('CHECKING CHANNEL INNACTIVE');
    console.log(allChannels.value);
    const channelsToRemove: Channel[] = [];
    allChannels.value.forEach((channel) => {
      // Calculate difference in days
      // Calculation taken from https://www.geeksforgeeks.org/how-to-calculate-the-number-of-days-between-two-dates-in-javascript/
      const nowDate = new Date();
      const lastActiveDate = new Date(channel.lastActive);
      const diffInTime = (nowDate.getTime() - lastActiveDate.getTime()) / 1000;
      const diffInDays = diffInTime / (3600 * 24);

      if (diffInDays >= 30) {
        console.log('CHANNEL INACTIVE');
        channelsToRemove.push(channel);
      }
    });
    channelsToRemove.forEach((channel) => {
      cancelChannel(channel.id);
    });
  }

  /**
   * Return
   */
  return {
    // state
    availableChannels,
    currentChannelMembers,
    currentActiveChannel,
    pendingChannels,

    // actions
    getChannelByName,
    addChannel,
    cancelChannel,
    joinChannel,
    inviteMember,
    removeMember,
    acceptInvitation,
    declineInvitation,
    loadChannels,
    kickMemberFromChannel,
    loadPendingChannels,
    setCurrentActiveChannel,
    checkChannelsInactive,
  };
});

/* 
Controller
*/

// only helper for 1st assignment
const getHighestChannelID = (channels: Channel[]): number => {
  return Math.max(...channels.map((channel) => parseInt(channel.id, 10)));
};
