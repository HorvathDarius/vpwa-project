import { Ref, ref } from 'vue';
import { defineStore } from 'pinia';
import { useNotifications } from 'src/utils/useNotifications';
import {
  Channel,
  User,
  UserChannelStatus,
  RawMessage,
  SerializedMessage,
  UserNotificationSetting,
} from 'src/contracts';
import { channelService, userService } from 'src/services';
import { useUserStore } from './user-store';

export interface ChannelStateInterface {
  loading: boolean;
  error: Error | null;
  messages: { [channel: string]: SerializedMessage[] };
  active: string | null;
}

/* 
Store
*/
export const useChannelStore = defineStore('channels', () => {
  /**
   * State
   */
  const availableChannels = ref<Channel[]>();
  const userStore = useUserStore();
  const pendingChannels = ref<Channel[]>([]);
  const activeChannelsMembers = ref<User[]>([]);
  const activeChannelMessages = ref<SerializedMessage[]>([]);
  const currentlyTyping = ref<{
    channel: string;
    username: string;
    message: string;
  } | null>(null);
  const isVisible = ref(true);

  const channelState: Ref<ChannelStateInterface> = ref({
    loading: false,
    error: null,
    messages: {},
    active: null,
  });

  /**
   * Getters
   */

  /**
   * Actions
   */
  // Cancel a channel
  async function cancelChannel(nickName: string) {
    try {
      await channelService.removeUser(
        channelState.value.active!,
        nickName,
        UserChannelStatus.LeftChannel
      );
      useNotifications(
        'success',
        `You successfully left channel ${channelState.value.active!}`
      );
      await userStore.checkUser();
      channelState.value.active = null;
      channelService.leave(channelState.value.active!);
      return;
    } catch (error: unknown) {
      useNotifications('error', '');
      throw error;
    }
  }

  function handleChannelListChange(channelName: string) {
    if (channelState.value.active === channelName) {
      channelState.value.active = null;
    }
  }

  // Invite a member to a channel
  async function inviteUser(nickName: string) {
    try {
      return await userService.inviteUser(channelState.value.active!, nickName);
    } catch (error: unknown) {
      useNotifications('error', '');
      throw error;
    }
  }

  // Join a channel
  async function joinChannel(channelName: string, channelType: string) {
    try {
      const channel = await channelService.joinChannel(
        channelName,
        channelType
      );
      useNotifications(
        'success',
        `You have joined the channel ${channel.name}`
      );
      await userStore.checkUser();
      return;
    } catch (error: unknown) {
      useNotifications('error', '');
      throw error;
    }
  }

  // Remove member from channel
  async function removeMember(nickName: string) {
    try {
      await channelService.removeUser(
        channelState.value.active!,
        nickName,
        UserChannelStatus.KickedOut
      );
      useNotifications('success', `You kicked ${nickName}`);
      return;
    } catch (error: unknown) {
      useNotifications('error', '');
      throw error;
    }
  }

  // Accept pending invite to channel
  async function respondToInvitation(decision: string, channelID: string) {
    try {
      const accept = decision === 'accept' ? true : false;
      const response = await channelService.resolveChannelInvite(
        channelID,
        accept
      );
      userStore.checkUser();
      return response;
    } catch (error: unknown) {
      useNotifications('error', '');
      throw error;
    }
  }

  // Load the pending channels
  async function loadPendingChannels() {
    try {
      const channels = await channelService.getPendingChannels();
      pendingChannels.value = channels;
      return channels;
    } catch (error: unknown) {
      // useNotifications('error', '');
      throw error;
    }
  }

  // Kick member from cahnnel
  async function kickMemberFromChannel(nickName: string) {
    try {
      await channelService.removeUser(
        channelState.value.active!,
        nickName,
        UserChannelStatus.KickedOut
      );
      useNotifications('success', `You kicked ${nickName}`);
      return;
    } catch (error: unknown) {
      useNotifications('error', '');
      throw error;
    }
  }

  // Load the current members of a channel
  async function loadCurrentChannelMembers() {
    try {
      const users = await channelService.getChannelUsers(
        channelState.value.active!
      );
      activeChannelsMembers.value = users;
      return users;
    } catch (error: unknown) {
      useNotifications('error', '');
      throw error;
    }
  }

  function preloadChannelInfo() {
    // Load pending channels
    loadPendingChannels();
    // Load current channel members
    loadCurrentChannelMembers();
  }

  async function getAll() {
    try {
      const channels = await channelService.getAll();
      availableChannels.value = channels;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * MUTATIONS
   */
  function loadingStart() {
    channelState.value.loading = true;
    channelState.value.error = null;
  }

  function loadingSuccess({
    channel,
    messages,
  }: {
    channel: string;
    messages: SerializedMessage[];
  }) {
    channelState.value.loading = false;
    channelState.value.messages[channel] = messages;
  }

  function loadingError(error: Error) {
    channelState.value.loading = false;
    channelState.value.error = error;
  }

  function clearChannel(channel: string) {
    delete channelState.value.messages[channel];
  }

  function setActive(channel: string) {
    channelState.value.active = channel;
  }

  function newMessage({
    channel,
    message,
  }: {
    channel: string;
    message: SerializedMessage;
  }) {
    if (!channelState.value.messages[channel]) {
      channelState.value.messages[channel] = [];
    }
    channelState.value.messages[channel].push(message);
    currentlyTyping.value = null;

    if (isVisible.value === false) {
      if(userStore.authInfo.user?.notificationSetting === UserNotificationSetting.Off) {
        console.log('NO NOTIFICATION');
        return;
      } 

      if (userStore.authInfo.user?.notificationSetting === UserNotificationSetting.ShowMentions) {
        console.log('MENTIONS')
      } 

      const img = '/icons/icon-192x192.png';
      const text = message.content;
      const notification = new Notification(channel, {
        body: text,
        icon: img,
      });
    }
  }

  /**
   * ACTIONS
   */
  async function join(channel: string) {
    try {
      loadingStart();
      const messageBatch = await channelService.join(channel).loadMessages({});
      messageBatch.reverse();
      const messages = [...messageBatch];
      // const messages = await channelService.join(channel).loadMessages();
      loadingSuccess({ channel, messages });
    } catch (error) {
      loadingError(error as Error);
      throw error;
    }
  }

  async function loadMoreMessages(
    channel: string,
    index: number
  ): Promise<boolean> {
    try {
      loadingStart();
      const messageBatch = await channelService
        .in(channel)!
        .loadMessages({ index: index * 10 + 1 });
      messageBatch.reverse();

      const messages = [
        ...messageBatch,
        ...channelState.value.messages[channel],
      ];
      loadingSuccess({ channel, messages });

      return messageBatch.length > 0 ? true : false;
    } catch (error) {
      loadingError(error as Error);
      throw error;
    }
  }

  async function leave(channel: string | null) {
    const leaving: string[] = channel !== null ? [channel] : joinedChannels();

    leaving.forEach((channel) => {
      channelService.leave(channel);
      clearChannel(channel);
    });
  }

  async function addMessage({
    channel,
    message,
    mention,
  }: {
    channel: string;
    message: RawMessage;
    mention: number;
  }) {
    const newMessageVariable = await channelService
      .in(channel)
      ?.addMessage(message, mention);
    newMessage({ channel, message: newMessageVariable as SerializedMessage });
  }

  function handleUserTyping(
    channel: string,
    username: string,
    message: string
  ) {
    channelService.in(channel)?.broadcastTyping(channel, username, message);
  }

  /**
   * GETTERS
   */
  function joinedChannels() {
    return Object.keys(channelState.value.messages);
  }

  function currentMessages() {
    return channelState.value.active !== null
      ? channelState.value.messages[channelState.value.active]
      : [];
  }

  function lastMessageOf() {
    return (channel: string) => {
      const messages = channelState.value.messages[channel];
      return messages.length > 0 ? messages[messages.length - 1] : null;
    };
  }

  /**
   * Return
   */
  return {
    // state
    availableChannels,
    pendingChannels,
    activeChannelsMembers,
    activeChannelMessages,
    currentlyTyping,
    isVisible,

    // actions
    cancelChannel,
    joinChannel,
    inviteUser,
    removeMember,
    respondToInvitation,
    kickMemberFromChannel,
    loadPendingChannels,
    preloadChannelInfo,
    handleChannelListChange,
    channelState,
    loadCurrentChannelMembers,
    getAll,

    // mutations
    loadingStart,
    loadingSuccess,
    loadingError,
    clearChannel,
    setActive,
    newMessage,
    loadMoreMessages,

    // actions
    join,
    leave,
    addMessage,
    handleUserTyping,

    // getters
    joinedChannels,
    currentMessages,
    lastMessageOf,
  };
});

/* 
Controller
*/
