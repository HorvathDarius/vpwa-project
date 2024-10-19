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
          <q-item-section avatar>
            <q-avatar>
              <img src="/blankProfile.jpg" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">
              <span class="text-weight-bold">
                {{ userStore.currentUserData?.nickName }}
              </span>
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
            <q-btn-dropdown
              round
              class="user-btn"
              no-icon-animation
              content-class="transparent see-through-style"
              :dropdown-icon="userProfileStatusIcon"
              @click="handleActivityClick"
            >
              <q-list>
                <q-item
                  dark
                  clickable
                  v-for="(status, i) in userStatus"
                  :key="i"
                  v-close-popup
                  @click="() => handleClickActivityStatus(status)"
                >
                  <q-item-section>
                    <div class="row items-center no-wrap">
                      <q-icon left v-if="status === 'Active'" name="wifi" />
                      <q-icon
                        left
                        v-else-if="status === 'Do not disturb'"
                        name="notifications_off"
                      />
                      <q-icon
                        left
                        v-else-if="status === 'Offline'"
                        name="wifi_off"
                      />
                      <q-item-label>{{ status }}</q-item-label>
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
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

const userStore = useUserStore();

const router = useRouter();

const userStatus = ['Active', 'Do not disturb', 'Offline'];
const notificationSetting = ['all', 'mentionsOnly', 'off'];

const showProfileModal = ref(false);
const userProfileStatusIcon = ref('wifi');

const handleClickActivityStatus = (status: string) => {
  userProfileStatusIcon.value =
    status === 'Active'
      ? 'wifi'
      : status === 'Do not disturb'
      ? 'notifications_off'
      : 'wifi_off';

  userStore.updateUserSettings({
    ...userStore.currentUserData,
    status,
  });
};

const handleActivityClick = (e: Event) => {
  e.stopPropagation();
  console.log('CHANGING ACTIVTY');
};

const handleLogout = () => {
  userStore.logout();
  router.push('/login');
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
