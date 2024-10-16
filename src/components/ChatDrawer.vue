<template>
  <q-page-container class="gt-xs col-3" style="background: rgba(0, 0, 0, 0.1)">
    <q-page class="position-relative">
      <div class="absolute-full">
        <AvailableChannelsComponent :conversations="conversations" />

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
      </div>

      <ModalWindowComponent v-model="showProfileModal">
        <q-card class="see-through-style">
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
import ModalWindowComponent from './ModalWindowComponent.vue';
import AvailableChannelsComponent from './AvailableChannelsComponent.vue';

const { conversations } = defineProps(['conversations']);

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
