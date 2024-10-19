<template>
  <q-page-container class="gt-xs col-3" style="background: rgba(0, 0, 0, 0.1)">
    <q-page class="position-relative">
      <div class="absolute-full">
        <AvailableChannelsComponent :channels="channels" />

        <q-item
          style="
            height: calc(15% - 2px);
            border-top: 1px solid #777;
            border-right: 1px solid #777;
          "
          dark
          clickable
          class="col-1"
          @click="showProfileModal = true"
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
            <q-btn-dropdown
              push
              round
              no-icon-animation
              color="primary"
              content-class="transparent see-through-style"
              :dropdown-icon="userProfileStatusIcon"
              @click="handleActivityClick"
            >
              <q-list>
                <q-item
                  dark
                  clickable
                  v-close-popup
                  @click="() => handleClickActivityStatus('wifi')"
                >
                  <q-item-section>
                    <div class="row items-center no-wrap">
                      <q-icon left name="wifi" />
                      <q-item-label>Active</q-item-label>
                    </div>
                  </q-item-section>
                </q-item>

                <q-item
                  dark
                  clickable
                  v-close-popup
                  @click="() => handleClickActivityStatus('notifications_off')"
                >
                  <q-item-section>
                    <div class="row items-center no-wrap">
                      <q-icon left name="notifications_off" />
                      <q-item-label>Do Not Disturb</q-item-label>
                    </div>
                  </q-item-section>
                </q-item>

                <q-item
                  dark
                  clickable
                  v-close-popup
                  @click="() => handleClickActivityStatus('wifi_off')"
                >
                  <q-item-section>
                    <div class="row items-center no-wrap">
                      <q-icon left name="wifi_off" />
                      <q-item-label>Offline</q-item-label>
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
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
import ModalWindowComponent from './ModalWindowComponent.vue';
import AvailableChannelsComponent from './AvailableChannelsComponent.vue';
import UserProfileCard from './UserProfileCard.vue';
import { useUserStore } from 'src/stores/user-store';

const userStore = useUserStore();

const { channels } = defineProps(['channels']);

const userStatus = ['active', 'idle', 'offline'];
const notificationSetting = ['all', 'mentionsOnly', 'off'];

const showProfileModal = ref(false);
const userProfileStatusIcon = ref('wifi');

const handleClickActivityStatus = (status: string) => {
  userProfileStatusIcon.value = status;
};

const handleActivityClick = (e: Event) => {
  e.stopPropagation();
  console.log('CHANGING ACTIVTY');
};
</script>
