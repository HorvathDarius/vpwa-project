import {
  User,
  UserNotificationSetting,
  UserStatus,
} from '../components/models';
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { usersMock } from 'src/mocks/usersMock';

/* 
Store
*/
export const useUserStore = defineStore('users', () => {
  /**
   * State
   */
  const allUsers = ref<User[]>(usersMock);
  const currentUserData = ref<User | undefined>(usersMock[0]);

  /**
   * Getters
   */

  /**
   * Actions
   */
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
  }

  function updateUserSettings(userData: any) {
    currentUserData.value = {
      ...currentUserData.value,
      fullName: userData.fullName,
      email: userData.email,
      nickName: userData.nickName,
      passwordHash: userData.passwordHash,
      status: userData.status,
      notificationSetting: userData.notificationSetting,
    } as User;
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
