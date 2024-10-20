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
  // Get channel by id
  function getChannelById(channelID: string) {
    console.log(channelID);
    return allChannels.value.find((channel) => channel.id === channelID);
  }

  // Get channel by name
  function getChannelByName(channelName: string) {
    console.log(channelName);
    return allChannels.value.find((channel) => channel.name === channelName);
  }

  // Create a channel
  function addChannel(channel: Channel, user: User) {
    // Get next id - this is a helper function, will be done by DB
    const channelId = getHighestChannelID(allChannels.value) + 1;

    // Set new ID
    channel.id = channelId.toString();

    channelsMock.push(channel);
    availableChannels.value.push(channel);

    // Update state
    setCurrentActiveChannel(channel);
    inviteMember(user);
  }

  // Cancel a channel
  function cancelChannel(channelID: string | undefined) {
    // Delete from all channels mock
    allChannels.value = allChannels.value.filter(
      (channel) => channel.id !== channelID
    );
    // Delete from list of available channels
    availableChannels.value = availableChannels.value.filter(
      (channel) => channel.id !== channelID
    );
    // Delete records of user-channel relationship
    userChannelRecords.value = userChannelRecords.value.filter(
      (record) => record.channelID !== channelID
    );
  }

  // Invite a member to a channel
  function inviteMember(user: User) {
    // Create user-channel record with pending invite status
    const invite = {
      userID: user.id,
      channelID: currentActiveChannel.value!.id,
      userRole: UserRole.Member,
      kicks: 0,
      userChannelStatus: UserChannelStatus.PendingInvite,
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
      deletedAt: '',
    };

    // Add to user-channel records
    userChannelsMock.push(invite);
    userChannelRecords.value.push(invite);
  }

  // Join a channel
  function joinChannel(newUser: User, channel: Channel) {
    // Create user-channel record with member status
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

    // Set as current active and load details about channel
    setCurrentActiveChannel(channel);
    loadChannels(newUser.id, userChannelRecords.value);
    loadCurrentChannelMembers(currentActiveChannel.value!.id);
  }

  // Remove member from channel
  function removeMember(userID: string | undefined) {
    // Remove user from  members of the cahnnel
    currentChannelMembers.value = currentChannelMembers.value.filter(
      (user) => user.id !== userID
    );

    // Find the user-channel record we want to remove
    const removedUserChannelRecord = userChannelRecords.value.find(
      (record) =>
        record.userID === userID &&
        record.channelID === currentActiveChannel.value?.id
    );

    // Remove from array
    const newUserChannelRecord = userChannelRecords.value.filter(
      (record) => record !== removedUserChannelRecord
    );

    // Reload the channels with new data
    loadChannels(userID, newUserChannelRecord);
  }

  // Accept pending invite to channel
  function acceptInvitation(userID: string, channelID: string) {
    // Find the user-channel record we want to update
    const acceptUserChannelRecord = userChannelRecords.value.find(
      (record) => record.userID === userID && record.channelID === channelID
    );
    // Set new member status
    acceptUserChannelRecord!.userChannelStatus = UserChannelStatus.InChannel;

    // Get the channel
    const channel = getChannelById(channelID);

    // Remove the channel as a pending invite channel
    // because we want to display it as a normal channel
    pendingChannels.value.splice(pendingChannels.value.indexOf(channel!), 1);

    // Set the channel as the current active channel
    setCurrentActiveChannel(channel!);
    // Load details about channel
    loadChannels(userID, userChannelRecords.value);
    loadCurrentChannelMembers(currentActiveChannel.value!.id);
  }

  // Decline pending invite to channel
  function declineInvitation(userID: string, channelID: string) {
    // Find user-channel record we want to remove
    const removedUserChannelRecord = userChannelRecords.value.find(
      (record) => record.userID === userID && record.channelID === channelID
    );

    const indexOfRemovedRecord = userChannelRecords.value.indexOf(
      removedUserChannelRecord!
    );
    // Remove from array
    userChannelRecords.value.splice(indexOfRemovedRecord, 1);
    // Reload channels
    loadChannels(userID, userChannelRecords.value);
  }

  // Load the channels based on user and user-channel records
  function loadChannels(
    userID: string | undefined,
    userChannelRecord: UserChannel[] = userChannelsMock
  ) {
    // Filter based on user, and only if member already
    const userChannelIds = userChannelRecord
      .filter(
        (item) =>
          item.userID === userID &&
          item.userChannelStatus !== UserChannelStatus.KickedOut &&
          item.userChannelStatus !== UserChannelStatus.PendingInvite
      ) // Filter for the user and ensure they are in the channel
      .map((item) => item.channelID); // Extract channel IDs

    // Also find pending invites
    pendingChannels.value = loadPendingChannels(userID, userChannelRecord);

    // Filter available channels based on the channel IDs
    availableChannels.value = channelsMock.filter((channel) =>
      userChannelIds.includes(channel.id)
    );

    // Merge pending channels with available channels
    // Pending should be on top
    availableChannels.value = [
      ...pendingChannels.value,
      ...availableChannels.value,
    ];
  }

  // Load the pending channels
  function loadPendingChannels(
    userID: string | undefined,
    userChannelRecord: UserChannel[] = userChannelsMock
  ) {
    // Same logic as above
    // but now we search for pending user-channel records
    const userChannelIds = userChannelRecord
      .filter(
        (item) =>
          item.userID === userID &&
          item.userChannelStatus === UserChannelStatus.PendingInvite
      ) // Filter for the user to be in a pending invite
      .map((item) => item.channelID); // Extract channel IDs

    // Return the filtered items
    return channelsMock.filter((channel) =>
      userChannelIds.includes(channel.id)
    );
  }

  // Kick member from cahnnel
  function kickMemberFromChannel(
    userID: string,
    channelID: string,
    userName: string
  ) {
    // Find the user-channel record we want to update
    const record = loadUserChannelRecords(userID, channelID);
    // Add penalization
    record!.kicks++;

    useNotifications('info', `${userName} has ${record!.kicks} kicks`);

    // If 3 penalizations
    if (record!.kicks == 3) {
      record!.userChannelStatus = UserChannelStatus.KickedOut;
      // Remove
      removeMember(userID);
      useNotifications(
        'info',
        `${userName} has been kicked out of the channel`
      );
    }
  }

  // Find user-channel record
  function loadUserChannelRecords(userID: string, channelID: string) {
    return userChannelRecords.value.find(
      (record) => record.channelID === channelID && record.userID === userID
    );
  }

  // Load the current members of a channel
  function loadCurrentChannelMembers(channelID: string) {
    const filteredChannels = userChannelsMock.filter(
      (channel) => channel.channelID === channelID
    );

    // Get all members from the chanenl
    const memberIDs = filteredChannels.map((channel) => channel.userID);
    const uniqueIds: string[] = [];

    // Filter only unique ids
    memberIDs.forEach((id) => {
      if (!uniqueIds.includes(id)) {
        uniqueIds.push(id);
      }
    });

    // Get the user details
    const members = usersMock.filter((user) => uniqueIds.includes(user.id));
    // Set the current members
    currentChannelMembers.value = members;
  }

  // Set current active channel
  function setCurrentActiveChannel(channel: Channel) {
    // Set the current active channel
    currentActiveChannel.value = channel;
    // Load members
    loadCurrentChannelMembers(channel.id);
    // And messages
    messageStore.loadMessages(channel.id);
  }

  // Check if channels are inactive
  function checkChannelsInactive() {
    // Array for channels to remove
    const channelsToRemove: Channel[] = [];
    // Loop through all channels
    allChannels.value.forEach((channel) => {
      // Calculate difference in days
      // Calculation taken from https://www.geeksforgeeks.org/how-to-calculate-the-number-of-days-between-two-dates-in-javascript/
      const nowDate = new Date();
      const lastActiveDate = new Date(channel.lastActive);
      const diffInTime = (nowDate.getTime() - lastActiveDate.getTime()) / 1000;
      const diffInDays = diffInTime / (3600 * 24);

      // If inactive for 30+ days add to array
      if (diffInDays >= 30) {
        channelsToRemove.push(channel);
      }
    });
    // Remove channels that are in array
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
