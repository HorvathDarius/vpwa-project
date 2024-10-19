import { User } from '../components/models';
import { ref } from 'vue';
import { defineStore } from 'pinia';

/* 
Store
*/
export const useCurrentUserStore = defineStore('currentUser', () => {
  /**
   * State
   */
  const userData = ref<User>();

  /**
   * Getters
   */

  /**
   * Actions
   */
  function getUserData(userID: string) {
    userData.value = undefined;
  }

  /**
   * Return
   */
  return {
    // state
    userData,

    // actions
    getUserData,
  };
});

/* 
Controller
*/
