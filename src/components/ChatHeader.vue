<template>
  <q-header elevated class="bg-gradient row">
    <q-toolbar class="text-black q-px-lg">
      <q-avatar>
        <img src="/blankProfile.jpg" />
      </q-avatar>

      <span class="q-subtitle-1 q-pl-md text-white text-bold">
        SLACK VPWA PROJECT
      </span>

      <q-space />

      <q-icon
        name="menu"
        class="text-white lt-sm"
        size="lg"
        @click="handleClickMenuButton"
      />

      <ModalWindowComponent v-model="showModalChannelWindow" title="Menu">
        <q-separator dark inline style="height: 2px" />

        <q-tabs
          dense
          v-model="tab"
          class="text-grey"
          active-color="white"
          indicator-color="white"
          align="justify"
          narrow-indicator
          inline-label
        >
          <q-tab name="channels" label="Channels" icon="groups" />
          <q-tab
            name="account"
            label="Account Settings"
            icon="account_circle"
          />
        </q-tabs>

        <q-separator />

        <q-tab-panels
          v-model="tab"
          animated
          class="transparent"
          style="max-height: 60vh; min-height: 60vh"
        >
          <q-tab-panel name="channels" class="transparent">
            <div class="position-relative">
              <div class="absolute-full">
                <AvailableChannelsComponent :conversations="conversations" />
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="account">
            <UserProfileCard
              :full-name="currentlyLoggedUserMock.fullName"
              :email="currentlyLoggedUserMock.email"
              :username="currentlyLoggedUserMock.username"
              :password-hash="currentlyLoggedUserMock.passwordHash"
              :status="currentlyLoggedUserMock.status"
              :notification-setting="
                currentlyLoggedUserMock.notificationSetting
              "
              :status-options="userStatus"
              :notification-options="notificationSetting"
            ></UserProfileCard>
          </q-tab-panel>
        </q-tab-panels>
      </ModalWindowComponent>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ModalWindowComponent from './ModalWindowComponent.vue';
import { conversations } from 'src/mocks/chatChannelMock';
import AvailableChannelsComponent from './AvailableChannelsComponent.vue';
import UserProfileCard from './UserProfileCard.vue';

const showModalChannelWindow = ref(false);
const tab = ref('channels');

const currentlyLoggedUserMock = ref({
  fullName: 'John Doe',
  email: 'john.doe@gmail.com',
  username: 'johny123',
  passwordHash: 'b2c701af',
  status: 'active',
  notificationSetting: 'all',
});

const userStatus = ['active', 'idle', 'offline'];
const notificationSetting = ['all', 'mentionsOnly', 'off'];

const handleClickMenuButton = () => {
  showModalChannelWindow.value = !showModalChannelWindow.value;
};
</script>
