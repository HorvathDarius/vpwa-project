<template>
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
    <q-item v-for="(command, i) in handleUserRights()" :key="i">
      <q-badge
        class="full-width"
        style="border: 1px solid #777"
        outline
        align="middle"
        :label="command.name"
      />
    </q-item>
  </q-list>

  <q-list
    dark
    bordered
    padding
    class="rounded-borders absolute"
    :style="`z-index: 5000; bottom: 10%; left: 20px; backdrop-filter: blur(20px); 
    background: linear-gradient(90deg, rgba(2,2,14,1) 0%, rgba(1,6,20,1) 100%);
     ${showMentionHelper ? 'display: block;' : 'display: none;'}`"
  >
    <q-scroll-area style="height: 400px; width: 200px" class="overflow-scroll">
      <q-item
        clickable
        v-for="member in channelStore.currentChannelMembers.filter(
          (member) => member.id !== userStore.currentUserData?.id
        )"
        :key="member.id"
        @click="() => handleMentionClick(member.id)"
      >
        <q-item-section>
          <q-avatar>
            <img src="/blankProfile.jpg" />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <span>{{ member.nickName }}</span>
        </q-item-section>
      </q-item>
    </q-scroll-area>
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
        ref="action-input-field"
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
            <q-item
              v-for="member in channelStore.currentChannelMembers"
              :key="member.id"
            >
              <q-item-section avatar>
                <q-avatar>
                  <img src="/blankProfile.jpg" />
                </q-avatar>
              </q-item-section>
              <q-item-section class="column">
                <span>
                  {{
                    member.id === userStore.currentUserData?.id ? '(me)' : ''
                  }}
                  {{
                    member.id === channelStore.currentActiveChannel?.createdBy
                      ? '(admin)'
                      : ''
                  }}
                </span>
                <span>
                  {{ member.nickName }}
                </span>
              </q-item-section>
              <q-item-section class="text-caption">
                <span> Member since: </span>
                <span>{{ member.createdAt }}</span>
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
import { ref, useTemplateRef } from 'vue';
import { date } from 'quasar';
import { useMessageStore } from 'src/stores/message-store';
import { useChannelStore } from 'src/stores/channel-store';
import { useUserStore } from 'src/stores/user-store';
import ModalWindowComponent from './ModalWindowComponent.vue';
import { useNotifications } from 'src/utils/useNotifications';
import {
  Channel,
  Message,
  User,
  UserStatus,
  UserNotificationSetting,
  ChannelType,
} from './models';

const actionInputField = useTemplateRef('action-input-field');
const messageData = ref('');
const showActionHelper = ref(false);
const showMentionHelper = ref(false);
const showListOfMembers = ref(false);
const messageStore = useMessageStore();
const channelStore = useChannelStore();
const userStore = useUserStore();

const commands = [
  { name: '/join', action: '', rights: '' },
  { name: '/invite', action: '', rights: 'admin' },
  { name: '/revoke', action: '', rights: 'admin' },
  { name: '/kick', action: '', rights: '' },
  { name: '/quit', action: '', rights: 'admin' },
  { name: '/cancel', action: '', rights: '' },
  { name: '/list', action: '', rights: '' },
];

const handleUserRights = () => {
  if (userStore.checkUserRights(channelStore.currentActiveChannel?.createdBy)) {
    return commands;
  } else {
    return commands.filter((command) => command.rights !== 'admin');
  }
};

const handleMessageSubmit = (): void => {
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

const handleMessageTyping = (value: string | null): void => {
  console.log('Typing:', value);
  if (value === '/') {
    showActionHelper.value = true;
  } else if (value?.endsWith('@')) {
    showMentionHelper.value = true;
  } else {
    showActionHelper.value = false;
    showMentionHelper.value = false;
  }
};

const handleAction = (message: string): void => {
  const splitAction = message.split(' ');

  switch (splitAction[0]) {
    case '/list':
      showListOfMembers.value = true;
      break;

    case '/invite':
      if (
        !userStore.checkUserRights(channelStore.currentActiveChannel?.createdBy)
      ) {
        console.log('ERROR - NOT ENOUGH RIGHTS');
        useNotifications('error', 'You do not have enough rights');
        break;
      }

      if (splitAction[1] === undefined) {
        console.log('ERROR - THERE IS NO USER SPECIFIED');
        useNotifications('error', 'No user was specified');
        break;
      }

      const foundUser = userStore.findUserByNickname(splitAction[1]);

      if (!foundUser) {
        console.log('ERROR - USER NOT FOUND');
        useNotifications('error', 'User not found');
        break;
      }

      channelStore.inviteMember(foundUser);

      useNotifications('add', `${foundUser.nickName} has joined the channel`);
      break;

    case '/kick':
      console.log('Kicking members');

      if (splitAction[1] === undefined) {
        console.log('ERROR - THERE IS NO USER SPECIFIED');
        break;
      }

      const userToKick = splitAction[1];
      const users = channelStore.currentChannelMembers;
      const newUsers = users.filter((user) => user.nickName !== userToKick);

      channelStore.currentChannelMembers = newUsers;

      useNotifications(
        `${splitAction[1]} just left the channel`,
        '/blankProfile.jpg'
      );
      break;

    case '/join':
      console.log('Joining channel');

      if (splitAction[1] === undefined) {
        console.log('ERROR - THERE IS NO CHANNEL SPECIFIED');
        useNotifications('error', 'No channel was specified');
        break;
      }

      let privateChannel = false;
      if (splitAction[2] !== undefined && splitAction[2] === 'private') {
        console.log(`third param - ${splitAction[2]}`);
        privateChannel = true;
      }

      const channel = channelStore.getChannel(splitAction[1]);
      if (channel) {
        console.log('Channel already exists');
        if (channel.type === ChannelType.Private) {
          useNotifications(
            'error',
            'The channel you are trying to join is a private one'
          );
          break;
        }
        channelStore.joinChannel(userStore.currentUserData!, channel);
      } else {
        console.log('No channel found, creating new channel');
        const newChannel: Channel = {
          id: '',
          name: splitAction[1],
          type: privateChannel ? ChannelType.Private : ChannelType.Public,
          createdBy: userStore.currentUserData!.id,
          numberOfUsers: 1,
          numberOfMessages: 0,
          lastActive: '',
          createdAt: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm'),
          updatedAt: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm'),
          deletedAt: '',
        };

        channelStore.addChannel(newChannel, userStore.currentUserData!);

        useNotifications('add', `Channel ${splitAction[1]} has been created`);
      }
      break;

    case '/cancel':
      if (
        userStore.checkUserRights(channelStore.currentActiveChannel?.createdBy)
      ) {
        console.log('Leaving channel ADMIN');
        channelStore.cancelChannel(channelStore.currentActiveChannel?.id);
        channelStore.currentActiveChannel = null;
      } else {
        console.log('Leaving channel NORMAL');
        channelStore.removeMember(userStore.currentUserData?.id);
        channelStore.currentActiveChannel = null;
      }
      break;
    default:
      console.log('No action found');
      useNotifications('error', 'No action found');
  }
};

const handleSendMessage = (message: string): void => {
  console.log('Sending message:', messageData.value);
  const timeStamp = Date.now();

  const newMessage: Message = {
    id: '1',
    userID: userStore.currentUserData?.id || 'me',
    channelID: channelStore.currentActiveChannel?.id || '',
    content: message,
    status: '',
    sentAt: date.formatDate(timeStamp, 'HH:mm'),
    createdAt: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm'),
    updatedAt: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm'),
    deletedAt: '',
  };

  messageStore.addMessage(newMessage);
};

const handleMentionClick = (id: string): void => {
  const member = channelStore.currentChannelMembers.find(
    (member) => member.id === id
  );
  console.log('Member:', member);
  messageData.value += `${member?.nickName} `;
  showMentionHelper.value = false;

  actionInputField.value?.focus();
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
