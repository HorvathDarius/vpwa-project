<template>
  <q-page-container class="gt-xs col-3" style="background: rgba(0, 0, 0, 0.1)">
    <q-page class="position-relative">
      <div class="absolute-full">
        <AvailableChannelsComponent />

        <q-item
          style="
            height: calc(15% - 2px);
            border-top: 1px solid #777;
            border-right: 1px solid #777;
            background-color: rgba(255, 255, 255, 0.05);
          "
          dark
          class="col-1"
        >
          <q-item-section>
            <q-item-label lines="1">
              <span class="text-weight-bold" style="margin-right: 0.5rem">
                {{ userStore.authInfo.user!.nickName }}
              </span>
              <q-badge
                :color="
                    userStore.authInfo.user!.status === UserStatus.Active
                      ? 'green'
                      : userStore.authInfo.user!.status === UserStatus.DND
                      ? 'red'
                      : 'orange'
                  "
                rounded
                ><q-tooltip>
                  {{ userStore.authInfo.user!.status }}
                </q-tooltip></q-badge
              >
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-btn
              icon="logout"
              round
              id="logout-btn"
              class="user-btn"
              @click="handleLogout"
            />
          </q-item-section>

          <q-item-section side>
            <q-btn
              icon="more_vert"
              round
              class="user-btn"
              @click="showProfileModal = true"
            />
          </q-item-section>
        </q-item>
      </div>

      <ModalWindowComponent v-model="showProfileModal" title="User Settings">
        <UserProfileCard
          :status-options="userStatus"
          :notification-options="notificationSetting"
        ></UserProfileCard>
      </ModalWindowComponent>
    </q-page>
  </q-page-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ModalWindowComponent from './ModalWindowComponent.vue';
import AvailableChannelsComponent from './AvailableChannelsComponent.vue';
import UserProfileCard from './UserProfileCard.vue';
import { useUserStore } from 'src/stores/user-store';
import { UserStatus } from 'src/contracts';

const userStore = useUserStore();
const router = useRouter();

const userStatus = ['active', 'do not disturb', 'offline'];
const notificationSetting = ['all', 'mentionsOnly', 'off'];

const showProfileModal = ref(false);

// Logout, clear session
const handleLogout = () => {
  userStore.logout();
  router.push('/auth/login');
};
</script>

<style>
.user-btn {
  transition: all 0.2s ease-in-out;
  border: 1px solid #555;
}

#logout-btn:hover {
  color: red;
}
</style>
