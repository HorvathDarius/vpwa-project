import {
  User,
} from '../contracts/Auth';
import { Ref, ref } from 'vue';
import { defineStore } from 'pinia';
import { usersMock } from 'src/mocks/usersMock';
import { useMessageStore } from './message-store';
import { authManager, authService } from 'src/services';
import { LoginCredentials, RegisterData } from 'src/contracts';
import { useChannelStore } from './channel-store';

interface AuthStateInterface {
  user: User | null,
  status: 'pending' | 'success' | 'error',
  errors: { message: string, field?: string}[]
}

/* 
Store
*/
export const useUserStore = defineStore('users', () => {
  /**
   * State
   */
  const messageStore = useMessageStore();
  const channelStore = useChannelStore();

  const allUsers = ref<User[]>(usersMock);
  const currentUserData = ref<User | undefined>(usersMock[0]);
  const authInfo: Ref<AuthStateInterface> = ref<AuthStateInterface>({
    user: null,
    status: 'pending',
    errors: []
  })

  /**
   * Getters
   */

  /**
   * Actions
   */
  // Find users by ID
  function findUserByID(userID: string) {
    return allUsers.value.find((user) => user.id === userID);
  }

  // Find user by nickname
  function findUserByNickname(nickname: string) {
    return allUsers.value.find((user) => user.nickName === nickname);
  }

  // Get data about a user based on id
  function getUserData(userID: string) {
    currentUserData.value = usersMock.filter((user) => user.id === userID)[0]; // user.id is unique in DB
  }

  // Check if user has admin rights for channel
  function checkUserRights(channelCreatorID: string | undefined) {
    return currentUserData.value?.id === channelCreatorID;
  }

  // Update the user settings
  function updateUserSettings(userData: User) {
    const user = allUsers.value.find((user) => user.id === userData.id);

    user!.fullName = userData.fullName;
    user!.email = userData.email;
    user!.nickName = userData.nickName;
    user!.status = userData.status;
    user!.notificationSetting = userData.notificationSetting;

    currentUserData.value = user;

    // Set the messages to not receive any new messages if offline
    messageStore.saveActualConversation(currentUserData.value!.status);
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
  function authenticationError(errors: { message: string, field?: string}[]) {
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
      console.table(authInfo.value.user)
      return user !== null;
    } catch (error) {
      authenticationError(error as { message: string, field?: string}[]);
      throw error;
    } 
  }
  async function register( form: RegisterData) {
    try {
      authneticationStart()
      const user = await authService.register(form)
      authenticationSuccess(null);
      return user
    } catch (error) {
      authenticationError(error as { message: string, field?: string}[]);
      throw error
    }
  }
  async function login(credentials: LoginCredentials) {
    try {
      authneticationStart()
      const apiToken = await authService.login(credentials)
      authenticationSuccess(null);
      // save api token to local storage and notify listeners
      authManager.setToken(apiToken.token)
      return apiToken
    } catch (error) {
      authenticationError(error as { message: string, field?: string}[]);
      throw error
    }
  }
  async function logout() {
    try {
      authneticationStart()
      await authService.logout()
      await channelStore.leave(null);
      authenticationSuccess(null);
      // remove api token and notify listeners
      authManager.removeToken()
    } catch (error) {
      authenticationError(error as { message: string, field?: string}[]);
      throw error
    }
  }

  /**
   * Return
   */
  return {
    // state
    currentUserData,
    authInfo,

    // actions
    findUserByID,
    findUserByNickname,
    getUserData,
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
    logout
  };
});

/* 
Controller
*/
