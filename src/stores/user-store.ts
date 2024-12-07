import { Ref, ref } from 'vue';
import { defineStore } from 'pinia';
import { authManager, authService } from 'src/services';
import { User, LoginCredentials, RegisterData, UpdateStatus } from 'src/contracts';
import { useChannelStore } from './channel-store';
import { channelService } from 'src/services';
import { userService } from 'src/services';

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
      await authService.update(userData);
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
      console.log('checkUser');
      authneticationStart();
      const user = await authService.me();
      // if (user?.id !== authInfo.value.user?.id) {
      //   await channelStore.join('');
      // }
      authenticationSuccess(user);
      console.table(authInfo.value.user);
      channelStore.loadPendingChannels();
      channelStore.getAll();
      userService.join();
      user?.channels.forEach((channel) => {
        channelService.join(channel.name);
      });
      return user !== null;
    } catch (error) {
      console.log('error');
      // authenticationError(error as { message: string, field?: string}[]);
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
      throw error;
    }
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

/* 
Controller
*/
