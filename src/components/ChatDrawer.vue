<template>
  <q-page-container class="col-4">
    <q-page class="column">
      <q-list class="col-11">
        <q-scroll-area style="height: 300px">
          <ChatChannelComponent
            v-for="conversation in conversations"
            :key="conversation.id"
            :onClick="handleSetConversation"
            :conversation="conversation"
          />
        </q-scroll-area>
      </q-list>

      <q-separator style="height: 2px" inset />

      <q-item dark clickable class="col-1" @click="showProfileModal = true">
        <q-item-section avatar>
          <q-avatar>
            <img :src="mainProfile.avatar" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label lines="1">
            <span class="text-weight-bold">
              {{ mainProfile.person }}
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

      <ModalWindowComponent v-model="showProfileModal">
        <q-card class="transparent see-through-style">
          <q-card-section>
            <div class="text-h6">Alert</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
            repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis
            perferendis totam, ea at omnis vel numquam exercitationem aut, natus
            minima, porro labore.
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </ModalWindowComponent>
    </q-page>
  </q-page-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { mainProfile } from 'src/mocks/chatChannelMock';
import ChatChannelComponent from './ChatChannelComponent.vue';
import ModalWindowComponent from './ModalWindowComponent.vue';

const { conversations, handleSetConversation } = defineProps([
  'conversations',
  'handleSetConversation',
]);

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
