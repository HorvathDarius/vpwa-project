import { BootParams, SocketManager } from './SocketManager';
import { useChannelStore } from 'src/stores/channel-store';
import { useUserStore } from 'src/stores/user-store';
import { useNotifications } from 'src/utils/useNotifications';

// creating instance of this class automatically connects to given socket.io namespace
// subscribe is called with boot params, so you can use it to dispatch actions for socket events
// you have access to socket.io socket using this.socket
class UserSocketManager extends SocketManager {
  channelStore = useChannelStore();
  userStore = useUserStore();

  public subscribe({}: BootParams): void {
    this.socket.on('error', () => useNotifications('error', 'Error occured'));

    // When new invitations arrive
    this.socket.on('userInvited', (userName: string) => {
      if (userName === this.userStore.authInfo.user?.nickName) {
        this.channelStore.loadPendingChannels();
      }
    });
  }

  public inviteUser(userName: string, channelName: string): void {
    this.emitAsync('inviteUser', userName, channelName);
  }
}

class UserService {
  private user: UserSocketManager | undefined = undefined;

  public join(): UserSocketManager {
    if (this.user) {
      //throw new Error(`User is already joined in channel "${name}"`);
      return this.user as UserSocketManager;
    }

    // connect to given user namespace
    const user = new UserSocketManager('/users');
    this.user = user;
    return user;
  }

  public leave(): boolean {
    if (!this.user) {
      return false;
    }

    // disconnect namespace and remove references to socket
    this.user.destroy();
    return true;
  }

  public getUser(): UserSocketManager | undefined {
    return this.user;
  }

  async inviteUser(channelName: string, nickName: string): Promise<void> {
    this.user?.inviteUser(nickName, channelName);
  }
}

export default new UserService();
