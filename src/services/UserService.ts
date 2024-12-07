import { BootParams, SocketManager } from './SocketManager';
import { useChannelStore } from 'src/stores/channel-store';
import { useUserStore } from 'src/stores/user-store';
import { useNotifications } from 'src/utils/useNotifications';
import { UserStatus, UserNotificationSetting } from 'src/contracts';

// creating instance of this class automatically connects to given socket.io namespace
// subscribe is called with boot params, so you can use it to dispatch actions for socket events
// you have access to socket.io socket using this.socket
class UserSocketManager extends SocketManager {
  channelStore = useChannelStore();
  userStore = useUserStore();

  public subscribe({}: BootParams): void {
    this.socket.on('error', (message: string) =>
      useNotifications('error', message)
    );

    // When new invitations arrive
    this.socket.on('userInvited', (userName: string) => {
      if (userName === this.userStore.authInfo.user?.nickName) {
        this.channelStore.loadPendingChannels();
      }
    });

    // When user changes status
    this.socket.on('statusChanged', () => {
      console.log('Status changed');
      //this.userStore.checkUser();
    });

    this.socket.on('settingsChanged', () => {
      console.log('Notification settings changed');
      //this.userStore.checkUser();
    });
  }

  public inviteUser(userName: string, channelName: string): void {
    this.emitAsync('inviteUser', userName, channelName);
  }

  public changeStatus(newStatus: UserStatus): void {
    console.log(newStatus, this.userStore.authInfo.user?.nickName);
    this.emitAsync(
      'statusChangeReq',
      this.userStore.authInfo.user?.nickName,
      newStatus
    );
  }

  public changeNotificationSettings(newSetting: UserNotificationSetting): void {
    this.emitAsync(
      'notificationsChangeReq',
      this.userStore.authInfo.user?.nickName,
      newSetting
    );
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

  async changeStatus(newStatus: UserStatus): Promise<void> {
    this.user?.changeStatus(newStatus);
  }

  async changeNotificationSettings(
    newSetting: UserNotificationSetting
  ): Promise<void> {
    this.user?.changeNotificationSettings(newSetting);
  }
}

export default new UserService();
