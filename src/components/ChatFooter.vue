<template>
  <q-list
    dark
    bordered
    padding
    class="rounded-borders absolute"
    :style="`z-index: 100; bottom: 10%; left: 20px; backdrop-filter: blur(20px); ${
      showActionHelper ? 'display: block;' : 'display: none;'
    }`"
  >
    <q-item>
      <q-item-section>
        <q-badge outline align="middle" label="/join" />
      </q-item-section>
    </q-item>

    <q-item>
      <q-badge outline align="middle" label="/invite" />
    </q-item>

    <q-item>
      <q-badge outline align="middle" label="/revoke" />
    </q-item>

    <q-item>
      <q-badge outline align="middle" label="/kick" />
    </q-item>

    <q-item>
      <q-badge outline align="middle" label="/quit" />
    </q-item>

    <q-item>
      <q-badge outline align="middle" label="/cancel" />
    </q-item>

    <q-item>
      <q-badge outline align="middle" label="/list" />
    </q-item>
  </q-list>

  <q-toolbar class="see-through-style transparent">
    <q-form @submit="handleMessageSubmit" class="full-width">
      <q-input
        rounded
        outlined
        dark
        dense
        placeholder="Type a message..."
        v-model="messageData"
        @update:model-value="(value) => handleMessageTyping(String(value))"
      />
    </q-form>
  </q-toolbar>

  <ModalWindowComponent v-model="showListOfMembers">
    <q-card class="transparent see-through-style">
      <q-card-section>
        <div class="text-h6 text-white">Channel members</div>
      </q-card-section>

      <q-separator />

      <q-card-section
        class="scroll transparent"
        style="
          min-height: 50vh;
          min-width: 50vh;
          max-height: 50vh;
          max-width: 50vh;
        "
      >
        <q-scroll-area style="height: 300px">
          <q-list separator dark>
            <q-item v-for="member in channelStore.members" :key="member.id">
              <q-item-section avatar>
                <q-avatar>
                  <img :src="member.avatar" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <span>
                  {{ member.nickName }}
                </span>
              </q-item-section>
              <q-item-section class="text-caption">
                <span> Member since: </span>
                <span>{{ member.joined }}</span>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat class="text-white" label="Close" v-close-popup />
      </q-card-actions>
    </q-card>
  </ModalWindowComponent>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { date, useQuasar } from 'quasar';
import { useChannelStore } from 'src/stores/channel-store';
import ModalWindowComponent from './ModalWindowComponent.vue';

const $q = useQuasar();
const messageData = ref('');
const showActionHelper = ref(false);
const showListOfMembers = ref(false);
const channelStore = useChannelStore();

const handleMessageSubmit = () => {
  const message = messageData.value.trim();

  if (message === '') {
    return;
  }

  console.log('Message submitted:', message);

  if (message[0] === '/') {
    console.log('Processing ACTION');
    handleAction(message);
  } else {
    console.log('Processing MESSAGE');
    handleSendMessage(message);
  }

  messageData.value = '';
};

const handleMessageTyping = (value: string | null) => {
  console.log('Typing:', value);
  if (value === '/') {
    console.log('ACTION ACTION ACITON');
    showActionHelper.value = true;
  } else {
    console.log('Typing:', value);
    showActionHelper.value = false;
  }
};

const handleAction = (message: string) => {
  console.log('ACTION', message);

  const splitAction = message.split(' ');

  console.log('Split action:', splitAction);

  switch (splitAction[0]) {
    case '/list':
      console.log('Showing members');
      showListOfMembers.value = true;
      break;
    case '/invite':
      console.log('Inviting members');

      if (splitAction[1] === undefined) {
        console.log('ERROR - THERE IS NO USER SPECIFIED');
        break;
      }

      const newUser = {
        id: 3,
        nickName: splitAction[1],
        avatar: '/blankProfile.jpg',
        joined: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm'),
      };

      channelStore.addUser(newUser);

      $q.notify({
        message: `${splitAction[1]} has joined the channel`,
        color: 'primary',
        textColor: 'white',
        position: 'top',
        avatar: '/blankProfile.jpg',
      });

      break;
    case '/kick':
      console.log('Kicking members');

      if (splitAction[1] === undefined) {
        console.log('ERROR - THERE IS NO USER SPECIFIED');
        break;
      }

      const userToKick = splitAction[1];
      const users = channelStore.members;
      const newUsers = users.filter((user) => user.nickName !== userToKick);

      channelStore.members = newUsers;

      $q.notify({
        message: `${splitAction[1]} just left the channel`,
        color: 'primary',
        textColor: 'white',
        position: 'top',
        avatar: '/blankProfile.jpg',
      });

      break;
    default:
      console.log('No action found');
  }
};

const handleSendMessage = (message: string) => {
  console.log('Sending message:', messageData.value);
  const timeStamp = Date.now();

  const newMessage = {
    id: 1,
    name: 'me',
    avatar: '/blankProfileReverse.jpg',
    text: [message],
    stamp: date.formatDate(timeStamp, 'HH:mm'),
    sent: true,
    bgColor: 'amber-7',
  };

  console.log(newMessage);
  channelStore.addMessage(newMessage);
};
</script>

<style>
.showActionHelper {
  display: block;
}

/*
Styling of the input text field 
*/
.q-field__control {
  background: rgba(0, 0, 0, 0.1);
}
</style>
