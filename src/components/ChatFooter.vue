<template>
  <div class="row no-wrap shadow-1">
    <q-toolbar class="transparent see-through-style">
      <q-list
        bordered
        padding
        class="rounded-borders absolute see-through-style"
        :style="` bottom: 100%; left: 20px; ${
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
      <q-form @submit="handleMessageSubmit" class="full-width">
        <q-toolbar class="text-white row full-width">
          <q-input
            rounded
            outlined
            dark
            dense
            color="white"
            label-color="white"
            class="col-grow q-mr-sm text-white"
            placeholder="Type a message..."
            v-model="messageData"
            @update:model-value="(value) => handleMessageTyping(value)"
          />
        </q-toolbar>
      </q-form>
    </q-toolbar>
  </div>

  <q-dialog v-model="showListOfMembers" class="justify-center">
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
        <q-list separator dark>
          <q-item v-for="member in members" :key="member.id">
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
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat class="text-white" label="Close" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { messageDataMock } from 'src/mocks/channelMessageMock';
import { date } from 'quasar';

const messageData = ref('');
const showActionHelper = ref(false);
const showListOfMembers = ref(false);
const { members } = messageDataMock;

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

const handleMessageTyping = (value) => {
  console.log('Typing:', value);
  if (value === '/') {
    console.log('ACTION ACTION ACITON');
    showActionHelper.value = true;
  } else {
    console.log('Typing:', value);
    showActionHelper.value = false;
  }
};

const handleAction = (message) => {
  console.log('ACTION', message);
  if (message === '/list') {
    console.log('Showing members');
    showListOfMembers.value = true;
  }
};

const handleSendMessage = (message) => {
  console.log('Sending message:', messageData.value);
  const timeStamp = Date.now();

  let newMessage = {
    id: 1,
    person: 'Me',
    avatar:
      'https://static-00.iconduck.com/assets.00/vue-icon-2048x1766-ntogpmti.png',
    caption: message,
    time: date.formatDate(timeStamp, 'HH:mm'),
    sent: true,
  };

  messageDataMock.push(newMessage);
  console.log(messageDataMock);
};
</script>

<style>
.showActionHelper {
  display: block;
}
</style>
