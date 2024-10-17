<template>
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="display: none">
    <defs>
      <filter id="blur-filter">
        <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
      </filter>
    </defs>
  </svg>

  <q-list
    bordered
    padding
    dark
    class="rounded-borders absolute"
    :style="[
      'z-index: 5000; bottom: 12%; left: 20px; background: linear-gradient(90deg, rgba(2,2,14,1) 0%, rgba(1,6,20,1) 100%);',
      showActionHelper ? 'display: block;' : 'display: none;',
    ]"
  >
    <q-item v-for="(command, i) in commands" :key="i">
      <q-badge
        class="full-width"
        style="border: 1px solid #777"
        outline
        align="middle"
        :label="command.name"
      />
    </q-item>
  </q-list>

  <q-toolbar
    class="see-through-style transparent"
    style="display: flex; align-items: center"
  >
    <q-form @submit="handleMessageSubmit" class="full-width">
      <q-input
        clearable
        rounded
        outlined
        dark
        dense
        counter
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

const commands = [
  { name: '/join', action: '' },
  { name: '/invite', action: '' },
  { name: '/revoke', action: '' },
  { name: '/kick', action: '' },
  { name: '/quit', action: '' },
  { name: '/cancel', action: '' },
  { name: '/list', action: '' },
];

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
  background: rgba(255, 255, 255, 0.1);
}
</style>
