import { RawMessage, SerializedMessage, User } from 'src/contracts';
import { BootParams, SocketManager } from './SocketManager';
import { useChannelStore } from 'src/stores/channel-store';
import { Channel } from 'src/contracts/index';
import { api } from 'src/boot/axios';

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
}

class ChannelService {
  private channels: Map<string, ChannelSocketManager> = new Map();

  public join(name: string): ChannelSocketManager {
    if (this.channels.has(name)) {
      throw new Error(`User is already joined in channel "${name}"`);
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
    userChannelStatus: string
  ): Promise<string> {
    const response = await api.patch('channels/users/status', {
      channelName,
      nickName,
      userChannelStatus,
    });
    return response.data;
  }

  async kickUser(
    channelName: string,
    nickName: string,
    userChannelStatus: string
  ): Promise<string> {
    const response = await api.patch('channels/users/status', {
      channelName,
      nickName,
      userChannelStatus,
    });
    return response.data;
  }

  async getChannelUsers(channelName: string): Promise<User[]> {
    const response = await api.get('channel/users', {
      params: { channelName },
    });
    return response.data;
  }

  async getPendingChannels(): Promise<Channel[]> {
    const response = await api.get('channels/pending', {});
    return response.data;
  }

  async resolveChannelInvite(
    channelId: string,
    accept: boolean
  ): Promise<void> {
    await api.post('channels/invite/resolve', { channelId, accept });
  }
}

export default new ChannelService();
