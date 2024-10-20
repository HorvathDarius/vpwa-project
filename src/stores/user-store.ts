import {
  User,
  UserNotificationSetting,
  UserStatus,
} from '../components/models';
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { usersMock } from 'src/mocks/usersMock';
import { useMessageStore } from './message-store';

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

    // Add new user to the mocks
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
   * Return
   */
  return {
    // state
    currentUserData,

    // actions
    findUserByID,
    findUserByNickname,
    getUserData,
    checkUserRights,
    login,
    register,
    updateUserSettings,
    logout,
  };
});

/* 
Controller
*/

// only helper for 1st assignment
const getHighestUserID = (users: User[]): number => {
  return Math.max(...users.map((user) => parseInt(user.id, 10)));
};
