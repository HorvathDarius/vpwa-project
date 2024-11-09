import {
  User,
  UserNotificationSetting,
  UserStatus,
} from '../components/models';
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { usersMock } from 'src/mocks/usersMock';
import { useMessageStore } from './message-store';
import { authManager, authService } from 'src/services';
import { LoginCredentials, RegisterData } from 'src/contracts';

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

  const allUsers = ref<User[]>(usersMock);
  const currentUserData = ref<User | undefined>(usersMock[0]);
  const state: AuthStateInterface = {
    user: null,
    status: 'pending',
    errors: []
  }

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

  // Login a user
  function login(userEmail: string, password: string) {
    // Set user as current logged in user
    currentUserData.value = usersMock.find(
      (user) => user.email === userEmail && user.passwordHash === password
    );
  }

  // Register a new user
  function register(
    userEmail: string,
    fullName: string,
    username: string,
    password: string
  ) {
    // Get next id
    const newUserID = getHighestUserID(usersMock) + 1;

    // Add new user to the mock DB
    usersMock.push({
      id: newUserID.toString(),
      fullName: fullName,
      email: userEmail,
      nickName: username,
      passwordHash: password,
      status: UserStatus.Active,
      notificationSetting: UserNotificationSetting.ShowAll,
      createdAt: 'now',
      updatedAt: 'now',
      deletedAt: '',
    });
    // Log in the user
    login(userEmail, password);
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

  // Remove the current session
  function logout() {
    currentUserData.value = undefined;
  }

  /**
   * AUTHENTICATION
   */
  function authneticationStart() {
    state.status = 'pending';
    state.errors = [];
  }
  function authenticationSuccess(user: User | null) {
    state.status = 'success';
    state.user = user;
  }
  function authenticationError(errors) {
    state.status = 'error';
    state.errors = errors;
  }

  function isAuthenticated() {
    return state.user !== null;
  }

  async function checkUser() {
    try {
      authneticationStart();
      const user = await authService.me();
      authenticationSuccess(user);
      return user !== null;
    } catch (error) {
      authenticationError(error);
      throw error;
    } 
  }

  async function register2( form: RegisterData) {
    try {
      authneticationStart()
      const user = await authService.register(form)
      authenticationSuccess(null);
      return user
    } catch (err) {
      authenticationError(err);
      throw err
    }
  }
  async function login2(credentials: LoginCredentials) {
    try {
      authneticationStart()
      const apiToken = await authService.login(credentials)
      authenticationSuccess(null);
      // save api token to local storage and notify listeners
      authManager.setToken(apiToken.token)
      return apiToken
    } catch (err) {
      authenticationError(err);
      throw err
    }
  }
  async function logout2() {
    try {
      authneticationStart()
      await authService.logout()
      authenticationSuccess(null);
      // remove api token and notify listeners
      authManager.removeToken()
    } catch (err) {
      authenticationError(err);
      throw err
    }
  }

  /**
   * Return
   */
  return {
    // state
    currentUserData,
    state,

    // actions
    findUserByID,
    findUserByNickname,
    getUserData,
    checkUserRights,
    login,
    register,
    updateUserSettings,
    logout,

    // auth
    authneticationStart,
    authenticationSuccess,
    authenticationError,
    isAuthenticated,
    checkUser,
    register2,
    login2,
    logout2
  };
});

/* 
Controller
*/

// only helper for 1st assignment
const getHighestUserID = (users: User[]): number => {
  return Math.max(...users.map((user) => parseInt(user.id, 10)));
};
