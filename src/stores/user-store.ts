import { Ref, ref } from 'vue';
import { defineStore } from 'pinia';
import { authManager, authService } from 'src/services';
import {
  User,
  LoginCredentials,
  RegisterData,
  UpdateStatus,
  UserStatus,
  UserNotificationSetting,
} from 'src/contracts';
import { useChannelStore } from './channel-store';
import { channelService } from 'src/services';
import { userService } from 'src/services';
import { useNotifications } from 'src/utils/useNotifications';

interface AuthStateInterface {
  user: User | null;
  status: 'pending' | 'success' | 'error';
  errors: { message: string; field?: string }[];
}

/* 
Store
*/
export const useUserStore = defineStore('users', () => {
  /**
   * State
   */
  const channelStore = useChannelStore();

  const authInfo: Ref<AuthStateInterface> = ref<AuthStateInterface>({
    user: null,
    status: 'pending',
    errors: [],
  });

  /**
   * Getters
   */

  /**
   * Actions
   */

  // Check if user has admin rights for channel
  function checkUserRights(channelName: string) {
    const channel = authInfo.value.user?.channels.find(
      (c) => c.name === channelName
    );
    return channel?.createdBy === authInfo.value.user?.id;
  }

  // Update the user settings
  async function updateUserSettings(userData: UpdateStatus) {
    try {
      await changeStatus(userData.status);
      await changeNotificationSettings(userData.notificationSetting);
      checkUser();
    } catch (error) {
      throw error;
    }
  }

  /**
   * AUTHENTICATION
   */
  function authneticationStart() {
    authInfo.value.status = 'pending';
    authInfo.value.errors = [];
  }
  function authenticationSuccess(user: User | null) {
    authInfo.value.status = 'success';
    authInfo.value.user = user;
  }
  function authenticationError(errors: { message: string; field?: string }[]) {
    authInfo.value.status = 'error';
    authInfo.value.errors = errors;
  }

  function isAuthenticated() {
    return authInfo.value.user !== null;
  }

  async function checkUser() {
    try {
      authneticationStart();
      const user = await authService.me();

      authenticationSuccess(user);
      channelStore.loadPendingChannels();
      channelStore.getAll();
      userService.join();
      // user?.channels.forEach((channel) => {
      //   channelService.join(channel.name);
      // });
      
      // If set offline status
      if (user?.status === UserStatus.Offline) {
        // unsubscribe from all channels
        channelStore.availableChannels?.map((channel) => {
          channelService.leave(channel.name);
        })
      }
    // if set active status
      if (user?.status === UserStatus.Active) {
        // subscribe to all channels
        channelStore.availableChannels?.map((channel) => {
          channelService.join(channel.name);
        })
      }

      return user !== null;
    } catch (error) {
      console.log('error');
      throw error;
    }
  }
  async function register(form: RegisterData) {
    try {
      authneticationStart();
      const user = await authService.register(form);
      authenticationSuccess(null);
      return user;
    } catch (error) {
      authenticationError(error as { message: string; field?: string }[]);
      useNotifications('error', 'Cannot register user');
      throw error;
    }
  }
  async function login(credentials: LoginCredentials) {
    try {
      authneticationStart();
      const apiToken = await authService.login(credentials);
      authenticationSuccess(null);
      // save api token to local storage and notify listeners
      authManager.setToken(apiToken.token);
      return apiToken;
    } catch (error) {
      authenticationError(error as { message: string; field?: string }[]);
      useNotifications('error', 'Invalid credentials');
      throw error;
    }
  }
  async function logout() {
    try {
      authneticationStart();
      await authService.logout();
      await channelStore.leave(null);
      authenticationSuccess(null);
      // remove api token and notify listeners
      authManager.removeToken();
    } catch (error) {
      authenticationError(error as { message: string; field?: string }[]);
      useNotifications('error', 'Error logging out');
      throw error;
    }
  }

  async function changeStatus(newStatus: UserStatus) {
    if (newStatus === authInfo.value.user?.status) {
      return;
    }
    await userService.changeStatus(newStatus);
  }

  async function changeNotificationSettings(
    newSetting: UserNotificationSetting
  ) {
    if (newSetting === authInfo.value.user?.notificationSetting) {
      return;
    }
    await userService.changeNotificationSettings(newSetting);
  }

  /**
   * Return
   */
  return {
    // state
    authInfo,

    // actions
    checkUserRights,
    updateUserSettings,

    // auth
    authneticationStart,
    authenticationSuccess,
    authenticationError,
    isAuthenticated,
    checkUser,
    register,
    login,
    logout,
  };
});
