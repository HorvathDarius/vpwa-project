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

      <ModalWindowComponent v-model="showModalChannelWindow">
        <q-card
          dark
          class="transparent see-through-style full-width full-height"
        >
          <q-card-section class="row justify-between">
            <span class="text-h6">Menu</span>
          </q-card-section>

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

          <q-tab-panels v-model="tab" animated class="transparent">
            <q-tab-panel name="channels" class="transparent">
              <div class="text-h6">Channels</div>
              <AvailableChannelsComponent :conversations="conversations" />
            </q-tab-panel>

            <q-tab-panel name="account">
              <div class="text-h6">Account Settings</div>
              PUT HERE ACCOUNT PAGE SETTINGS
            </q-tab-panel>
          </q-tab-panels>

          <q-card-actions align="right">
            <q-btn flat label="OK" color="white" v-close-popup />
          </q-card-actions>
        </q-card>
      </ModalWindowComponent>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ModalWindowComponent from './ModalWindowComponent.vue';
import { conversations } from 'src/mocks/chatChannelMock';
import AvailableChannelsComponent from './AvailableChannelsComponent.vue';

const showModalChannelWindow = ref(false);
const tab = ref('channels');

const handleClickMenuButton = () => {
  showModalChannelWindow.value = !showModalChannelWindow.value;
};
</script>
