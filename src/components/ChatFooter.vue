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
        v-for="member in channelStore.activeChannelsMembers.filter(
          (member) => member.id !== userStore.authInfo.user?.id
        )"
        :key="member.id"
        @click="() => handleMentionClick(member.nickName)"
      >
        <q-item-section>
          <q-avatar>
            <q-badge
              floating
              :color="
                member.status === UserStatus.Active
                  ? 'green'
                  : member.status === UserStatus.DND
                  ? 'orange'
                  : 'red'
              "
              rounded
            />
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
              v-for="member in channelStore.activeChannelsMembers"
              :key="member.id"
            >
              <q-item-section avatar>
                <q-avatar>
                  <q-badge
                    floating
                    :color="
                      member.status === UserStatus.Active
                        ? 'green'
                        : member.status === UserStatus.DND
                        ? 'orange'
                        : 'red'
                    "
                    rounded
                  />
                  <img src="/blankProfile.jpg" />
                </q-avatar>
              </q-item-section>
              <q-item-section class="column">
                <span>
                  {{ member.id === userStore.authInfo.user?.id ? '(me)' : '' }}
                  {{
                    member.id ===
                    userStore.authInfo.user?.channels.find(
                      (c) => c.name === channelStore.channelState.active
                    )?.createdBy
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
import { useChannelStore } from 'src/stores/channel-store';
import { useUserStore } from 'src/stores/user-store';
import ModalWindowComponent from './ModalWindowComponent.vue';
import { useNotifications } from 'src/utils/useNotifications';
import { UserStatus } from 'src/contracts/index';

const actionInputField = useTemplateRef('action-input-field');
const messageData = ref('');
const showActionHelper = ref(false);
const showMentionHelper = ref(false);
const showListOfMembers = ref(false);
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

// Check if user is admin in given channel and can see all commands
const handleUserRights = () => {
  if (channelStore.channelState.active === null) {
    return [{ name: '/join', action: '', rights: '' }];
  }
  console.log('ACTIVE - ', channelStore.channelState.active);
  if (userStore.checkUserRights(channelStore.channelState?.active)) {
    return commands;
  } else {
    return commands.filter((command) => command.rights !== 'admin');
  }
};

// Handle message submit
const handleMessageSubmit = (): void => {
  const message = messageData.value.trim();

  // If no message is typed
  if (message === '') {
    return;
  }

  // Determine if message or command
  if (message[0] === '/') {
    handleAction(message);
  } else {
    if (!message.includes('@')) {
      channelStore.addMessage({
        channel: channelStore.channelState.active as string,
        message,
        mention: 0,
      });

      // Clear after submit
      messageData.value = '';
      return;
    }
    const content = message.split(' ');

    const userName = content.filter((c) => c.startsWith('@'))[0].slice(1);

    channelStore.activeChannelsMembers.forEach((u) => {
      if (u.nickName === userName) {
        channelStore.addMessage({
          channel: channelStore.channelState.active as string,
          message,
          mention: Number(u.id),
        });
      }
    });
  }

  // Clear after submit
  messageData.value = '';
};

// Handle what user is typing
const handleMessageTyping = (value: string | null): void => {
  // If begins with '/' is command
  if (value === '/') {
    // Display command list
    showActionHelper.value = true;

    // If last char is '@' user wants to mention
  } else if (value?.endsWith('@')) {
    // Display list of members
    showMentionHelper.value = true;
  } else {
    // Hide the lists
    showActionHelper.value = false;
    showMentionHelper.value = false;
  }
};

// Main function for handling commands
const handleAction = (message: string): void => {
  // Split the message
  const splitAction = message.split(' ');

  // Check the command
  switch (splitAction[0]) {
    case '/list':
      // Dispplay modal with members
      showListOfMembers.value = true;
      break;

    // INVITE USERS
    case '/invite':
      if (channelStore.channelState.active === null) {
        useNotifications('error', 'No channel is active');
        break;
      }
      // Parse the message
      if (splitAction[1] === undefined) {
        useNotifications('error', 'No user was specified');
        break;
      }

      const nickName = splitAction[1];
      // Call method for adding memebr
      channelStore.inviteUser(nickName);
      break;

    // KICK A USER
    case '/kick':
      // User validation
      if (splitAction[1] === undefined) {
        useNotifications('error', 'No user was specified');
        break;
      }

      const userToKick = splitAction[1];
      channelStore.kickMemberFromChannel(userToKick);
      break;
    // REVOKE USER
    case '/revoke':
      // Check if user is admin
      if (!userStore.checkUserRights(channelStore.channelState.active!)) {
        useNotifications('error', 'You do not have enough rights');
        break;
      }

      // User validation as before
      if (splitAction[1] === undefined) {
        useNotifications('error', 'No user was specified');
        break;
      }

      // Find the user
      const userToRevoke = splitAction[1];

      channelStore.removeMember(userToRevoke);
      break;

    // JOIN A CHANNEL
    case '/join':
      // Channel input validation
      if (splitAction[1] === undefined) {
        useNotifications('error', 'No channel was specified');
        break;
      }
      // Get channel name
      const channelName = splitAction[1];

      // Check correct channel type is specified
      if (
        splitAction[2] !== undefined &&
        splitAction[2] !== 'public' &&
        splitAction[2] !== 'private'
      ) {
        useNotifications('error', 'Unrecognized channel type');
        break;
      }

      // Join the channel
      let privateChannel = 'public';
      if (splitAction[2] !== undefined && splitAction[2] === 'private') {
        privateChannel = 'private';
      }
      channelStore.joinChannel(channelName, privateChannel);
      break;

    // CANCEL MEMBERSHIP TO CHANNEL
    case '/cancel':
      // If admin cancel the whole channel
      channelStore.cancelChannel(userStore.authInfo.user!.nickName);
      break;

    // QUIT CHANNEL
    case '/quit':
      // Check if admin rights
      if (!userStore.checkUserRights(channelStore.channelState.active!)) {
        useNotifications('error', 'You do not have enough rights');
        break;
      }
      // Delete the whole channel
      channelStore.cancelChannel(userStore.authInfo.user!.nickName);
      break;

    // If not action found
    default:
      useNotifications('error', 'No action found');
  }
};

// Handle mention click
const handleMentionClick = (nickName: string): void => {
  // Find the member by id

  // Add it to the writing input
  messageData.value += `${nickName} `;
  showMentionHelper.value = false;

  // Focus back on the input field
  // @ts-expect-error Unkown property
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
