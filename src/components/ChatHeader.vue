<template>
  <q-header elevated class="bg-gradient row">
    <q-toolbar class="text-black q-px-lg">
      <span class="q-subtitle-1 q-pl-md text-white text-bold">
        {{
          channelStore.channelState?.active ?? 'VPWA Project Slack Application'
        }}
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
          <q-tab name="account" label="Account" icon="account_circle" />
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
                <AvailableChannelsComponent :channels="channels" />
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel
            name="account"
            style="overflow-y: auto; max-height: 60vh"
          >
            <UserProfileCard
              :full-name="currentUser!.fullName"
              :email="currentUser!.email"
              :username="currentUser!.nickName"
              :password-hash="currentUser!.passwordHash"
              :status="currentUser!.status"
              :notification-setting="
                currentUser!.notificationSetting
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
import AvailableChannelsComponent from './AvailableChannelsComponent.vue';
import UserProfileCard from './UserProfileCard.vue';
import { useChannelStore } from 'src/stores/channel-store';
import { useUserStore } from 'src/stores/user-store';

const showModalChannelWindow = ref(false);
const tab = ref('channels');
const { channels } = defineProps(['channels']);
const channelStore = useChannelStore();
const userStore = useUserStore();

const currentUser = ref(userStore.authInfo.user);

const userStatus = ['active', 'idle', 'offline'];
const notificationSetting = ['all', 'mentionsOnly', 'off'];

const handleClickMenuButton = () => {
  showModalChannelWindow.value = !showModalChannelWindow.value;
};
</script>
