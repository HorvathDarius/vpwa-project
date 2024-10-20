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
  function findUserByID(userID: string) {
    return allUsers.value.find((user) => user.id === userID);
  }
  function findUserByNickname(nickname: string) {
    return allUsers.value.find((user) => user.nickName === nickname);
  }
  function getUserData(userID: string) {
    currentUserData.value = usersMock.filter((user) => user.id === userID)[0]; // user.id is unique in DB
  }
  function checkUserRights(channelCreatorID: string | undefined) {
    return currentUserData.value?.id === channelCreatorID;
  }
  function login(userEmail: string, password: string) {
    currentUserData.value = usersMock.find(
      (user) => user.email === userEmail && user.passwordHash === password
    );
  }

  function register(
    userEmail: string,
    fullName: string,
    username: string,
    password: string
  ) {
    const newUserID = getHighestUserID(usersMock) + 1;

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
    login(userEmail, password);
  }

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
