<template>
  <q-drawer bordered show-if-above :breakpoint="640" class="bg-blue-6">
    <q-toolbar class="transparent" style="backdrop-filter: blur(10px)">
      <span> SLACK TEXT APP </span>

      <q-space />

      <q-btn round flat icon="more_vert">
        <q-menu auto-close :offset="[110, 8]">
          <q-list style="min-width: 150px">
            <q-item clickable>
              <q-item-section>New group</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>

    <q-scroll-area style="height: calc(100% - 100px)" class="transparent">
      <q-list>
        <q-item
          v-for="(conversation, index) in conversations"
          :key="conversation.id"
          clickable
          v-ripple
          @click="handleSetConversation(index)"
        >
          <q-item-section avatar>
            <q-avatar>
              <img :src="conversation.avatar" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">
              {{ conversation.person }}
            </q-item-label>
            <q-item-label class="conversation__summary" caption>
              <q-icon name="check" v-if="conversation.sent" />
              <q-icon name="not_interested" />
              {{ conversation.caption }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label caption>
              {{ conversation.time }}
            </q-item-label>
            <q-icon name="keyboard_arrow_down" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>

    <q-dialog
      v-model="showProfileModal"
      backdrop-filter="blur(0px) brightness(100%)"
    >
      <q-card class="transparent transparentStyle">
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
    </q-dialog>

    <q-item
      clickable
      @click="showProfileModal = true"
      style="background-color: teal; position: absolute; width: 100%; bottom: 0"
    >
      <q-item-section avatar>
        <q-avatar>
          <img :src="mainProfile.avatar" />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label lines="1">
          {{ mainProfile.person }}
        </q-item-label>
        <q-item-label class="conversation__summary" caption>
          <q-icon name="not_interested" />
        </q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-btn-dropdown
          push
          round
          no-icon-animation
          color="primary"
          :dropdown-icon="userProfileStatusIcon"
          @click="handleActivityClick"
        >
          <q-list>
            <q-item
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
  </q-drawer>
</template>

<script setup>
import { ref } from 'vue';
import { mainProfile } from 'src/mocks/chatChannelMock';

const { conversations, handleSetConversation } = defineProps([
  'conversations',
  'search',
  'handleSetConversation',
]);

const showProfileModal = ref(false);
const userProfileStatusIcon = ref('wifi');

const handleClickActivityStatus = (status) => {
  userProfileStatusIcon.value = status;
};

const handleActivityClick = (e) => {
  e.stopPropagation();
  console.log('CHANGING ACTIVTY');
};
</script>

<style>
.transparentStyle {
  background: rgba(43, 190, 234, 0.25);
  backdrop-filter: blur(10px);
}
</style>
