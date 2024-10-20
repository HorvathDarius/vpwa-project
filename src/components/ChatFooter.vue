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
              v-for="member in channelStore.currentChannelMembers"
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
import { Channel, ChannelType, UserStatus } from './models';

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

// Check if user is admin in given channel and can see all commands
const handleUserRights = () => {
  if (!channelStore.currentActiveChannel) {
    return [{ name: '/join', action: '', rights: '' }];
  }
  if (userStore.checkUserRights(channelStore.currentActiveChannel?.createdBy)) {
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
    messageStore.addMessage(
      userStore.currentUserData!.id,
      channelStore.currentActiveChannel!.id,
      message,
      ''
    );
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
      // If the channel is private, only the admin can invite members
      if (
        channelStore.currentActiveChannel?.type === ChannelType.Private &&
        !userStore.checkUserRights(channelStore.currentActiveChannel?.createdBy)
      ) {
        useNotifications('error', 'You do not have enough rights');
        break;
      }

      // Parse the message
      // If no user
      if (splitAction[1] === undefined) {
        useNotifications('error', 'No user was specified');
        break;
      }

      // Find the user
      const foundUser = userStore.findUserByNickname(splitAction[1]);

      // If no user found throw error
      if (!foundUser) {
        useNotifications('error', 'User not found');
        break;
      }

      // Call method for adding memebr
      channelStore.inviteMember(foundUser);

      useNotifications('add', `${foundUser.nickName} has joined the channel`);
      break;

    // REVOKE USER
    case '/revoke':
      // Check if user is admin
      if (
        !userStore.checkUserRights(channelStore.currentActiveChannel?.createdBy)
      ) {
        useNotifications('error', 'You do not have enough rights');
        break;
      }

      // User validation as before
      if (splitAction[1] === undefined) {
        useNotifications('error', 'No user was specified');
        break;
      }

      // Find the user
      const userToRevoke = userStore.findUserByNickname(splitAction[1]);

      // If no user found throw error
      if (!userToRevoke) {
        useNotifications('error', 'User not found');
        break;
      }

      // Filter the revoked user from the list of members
      const channelUsers = channelStore.currentChannelMembers;
      const remainingUsers = channelUsers.filter(
        (user) => user !== userToRevoke
      );

      channelStore.currentChannelMembers = remainingUsers;

      useNotifications(
        'info',
        `${splitAction[1]} has been revoked out of the channel`
      );
      break;

    // KICK A USER
    case '/kick':
      // Check if user is admin, if admin immediately remove from channel
      if (
        userStore.checkUserRights(channelStore.currentActiveChannel?.createdBy)
      ) {
        // User validation
        if (splitAction[1] === undefined) {
          useNotifications('error', 'No user was specified');
          break;
        }

        const userToKick = userStore.findUserByNickname(splitAction[1]);

        // Throw error if no user found
        if (!userToKick) {
          useNotifications('error', 'User not found');
          break;
        }

        // Remove from list of members
        const users = channelStore.currentChannelMembers;
        const newUsers = users.filter((user) => user !== userToKick);

        channelStore.currentChannelMembers = newUsers;

        useNotifications(
          'info',
          `${splitAction[1]} has been kicked out of the channel`
        );
        // If not admin, add penalty to the user
      } else {
        // User validation
        if (splitAction[1] === undefined) {
          useNotifications('error', 'No user was specified');
          break;
        }

        const userToKick = userStore.findUserByNickname(splitAction[1]);

        if (!userToKick) {
          useNotifications('error', 'User not found');
          break;
        }

        // Function to add penalization or kick if user has already been penalized 3 times
        channelStore.kickMemberFromChannel(
          userToKick.id,
          channelStore.currentActiveChannel!.id,
          userToKick.nickName
        );
      }
      break;

    // JOIN A CHANNEL
    case '/join':
      // Channel input validation
      if (splitAction[1] === undefined) {
        useNotifications('error', 'No channel was specified');
        break;
      }

      // Find the channel
      const channel = channelStore.getChannelByName(splitAction[1]);
      // If channel exists try to join
      if (channel) {
        // If private cannot join
        if (channel.type === ChannelType.Private) {
          useNotifications(
            'error',
            'The channel you are trying to join is a private one'
          );
          break;
        }
        // If public join channel
        channelStore.joinChannel(userStore.currentUserData!, channel);
      } else {
        // Determine if created channel should be private
        let privateChannel = false;
        if (splitAction[2] !== undefined && splitAction[2] === 'private') {
          privateChannel = true;
        }

        // Create the new channel
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

    // CANCEL MEMBERSHIP TO CHANNEL
    case '/cancel':
      // If admin cancel the whole channel
      if (
        userStore.checkUserRights(channelStore.currentActiveChannel?.createdBy)
      ) {
        channelStore.cancelChannel(channelStore.currentActiveChannel?.id);
        channelStore.currentActiveChannel = null;
        // else only leave channel
      } else {
        channelStore.removeMember(userStore.currentUserData?.id);
        channelStore.currentActiveChannel = null;
      }
      break;

    // QUIT CHANNEL
    case '/quit':
      // Check if admin rights
      if (
        !userStore.checkUserRights(channelStore.currentActiveChannel?.createdBy)
      ) {
        useNotifications('error', 'You do not have enough rights');
        break;
      }

      // Delete the whole channel
      channelStore.cancelChannel(channelStore.currentActiveChannel?.id);
      channelStore.currentActiveChannel = null;

      break;

    // If not action found
    default:
      useNotifications('error', 'No action found');
  }
};

// Handle mention click
const handleMentionClick = (id: string): void => {
  // Find the member by id
  const member = channelStore.currentChannelMembers.find(
    (member) => member.id === id
  );
  // Add it to the writing input
  messageData.value += `${member?.nickName} `;
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
