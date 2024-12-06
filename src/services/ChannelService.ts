import {
  RawMessage,
  SerializedMessage,
  User,
  UserChannelStatus,
} from 'src/contracts';
import { BootParams, SocketManager } from './SocketManager';
import { useChannelStore } from 'src/stores/channel-store';
import { Channel } from 'src/contracts/index';
import { api } from 'src/boot/axios';
import { useNotifications } from 'src/utils/useNotifications';

// creating instance of this class automatically connects to given socket.io namespace
// subscribe is called with boot params, so you can use it to dispatch actions for socket events
// you have access to socket.io socket using this.socket
class ChannelSocketManager extends SocketManager {
  channelStore = useChannelStore();

  public subscribe({}: BootParams): void {
    const channel = this.namespace.split('/').pop() as string;

    this.socket.on('message', (message: SerializedMessage) => {
      // store.commit('channels/NEW_MESSAGE', { channel, message });
      this.channelStore.newMessage({ channel, message });
    });

    // When list of channels change
    this.socket.on('channelListModified', (channelName: string) => {
      this.channelStore.getAll();
      this.channelStore.handleChannelListChange(channelName);
      useNotifications(
        'error',
        `Your membership in channel ${channelName} was cacelled.`
      );
    });

    // When new invitations arrive
    this.socket.on('newInvite', (channelName: string) => {
      this.channelStore.loadPendingChannels();
    });
  }

  public addMessage(
    message: RawMessage,
    mention: number
  ): Promise<SerializedMessage> {
    return this.emitAsync('addMessage', message, mention);
  }

  public loadMessages(): Promise<SerializedMessage[]> {
    return this.emitAsync('loadMessages');
  }

  public updateUserChannelStatus(
    userName: string,
    newStatus: UserChannelStatus
  ): void {
    this.emitAsync('updateUserChannelStatus', userName, newStatus);
  }
}

class ChannelService {
  private channels: Map<string, ChannelSocketManager> = new Map();

  public join(name: string): ChannelSocketManager {
    if (this.channels.has(name)) {
      //throw new Error(`User is already joined in channel "${name}"`);
      return this.channels.get(name) as ChannelSocketManager;
    }

    // connect to given channel namespace
    const channel = new ChannelSocketManager(`/channels/${name}`);
    this.channels.set(name, channel);
    return channel;
  }

  public leave(name: string): boolean {
    const channel = this.channels.get(name);

    if (!channel) {
      return false;
    }

    // disconnect namespace and remove references to socket
    channel.destroy();
    return this.channels.delete(name);
  }

  public in(name: string): ChannelSocketManager | undefined {
    return this.channels.get(name);
  }

  async getAll(): Promise<Channel[]> {
    const response = await api.get<Channel[]>('channels');
    return response.data;
  }

  async joinChannel(
    channelName: string,
    channelType: string
  ): Promise<Channel> {
    const response = await api.post('channels/join', {
      channelName,
      channelType,
    });
    return response.data;
  }

  async inviteUser(channelName: string, nickName: string): Promise<void> {
    await api.post('channels/invite', { channelName, nickName });
  }

  async removeUser(
    channelName: string,
    nickName: string,
    userChannelStatus: UserChannelStatus
  ): Promise<void> {
    const channel = this.channels.get(channelName);
    channel?.updateUserChannelStatus(nickName, userChannelStatus);
  }

  async getChannelUsers(channelName: string): Promise<User[]> {
    const response = await api.get('channel/users', {
      params: { channelName },
    });
    return response.data.users;
  }

  async getPendingChannels(): Promise<Channel[]> {
    const response = await api.get('channels/pending', {});
    return response.data.channels;
  }

  async resolveChannelInvite(
    channelId: string,
    accept: boolean
  ): Promise<void> {
    await api.post('channels/invite/resolve', { channelId, accept });
  }
}

export default new ChannelService();
