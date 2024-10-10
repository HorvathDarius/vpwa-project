<template>
  <q-footer class="transparent see-through-style">
    <q-form @submit="handleMessageSubmit">
      <q-toolbar class="text-white row">
        <q-input
          rounded
          outlined
          dark
          dense
          color="white"
          label-color="white"
          class="col-grow q-mr-sm text-white"
          v-model="messageData"
          placeholder="Type a message..."
        />
      </q-toolbar>
    </q-form>
  </q-footer>
</template>

<script setup>
import { ref } from 'vue';
import { messageDataMock } from 'src/mocks/channelMessageMock';
import { date } from 'quasar';

const { message } = defineProps(['message']);
const messageData = ref(message);

const handleMessageSubmit = () => {
  console.log('Message submitted:', messageData.value);
  const timeStamp = Date.now();

  let newMessage = {
    id: 1,
    person: 'Me',
    avatar:
      'https://static-00.iconduck.com/assets.00/vue-icon-2048x1766-ntogpmti.png',
    caption: messageData.value,
    time: date.formatDate(timeStamp, 'HH:mm'),
    sent: true,
  };

  messageDataMock.push(newMessage);
  console.log(messageDataMock);
};
</script>
