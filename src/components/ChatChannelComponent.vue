<template>
  <q-item
    dark
    clickable
    v-ripple
    class="q-pa-md"
    @click="() => handleChannelClick(channel as Channel)"
  >
    <q-item-section>
      <q-item-label lines="1" class="text-bold text-h6">
        {{ channel?.name }}
        <q-icon
          v-if="userStore.checkUserRights(channel?.createdBy)"
          name="star"
          style="
            vertical-align: top;
            background-color: rgba(252, 186, 3, 0.9);
            padding: 0.1rem;
            border-radius: 0.25rem;
          "
          class="q-ml-xs"
          ><q-tooltip> You are admin in this channel. </q-tooltip></q-icon
        >
        <q-icon
          v-if="channel?.type === 'private'"
          name="lock_person"
          style="
            vertical-align: top;
            background-color: rgba(140, 3, 252, 0.9);
            padding: 0.1rem;
            border-radius: 0.25rem;
          "
          class="q-ml-xs"
          ><q-tooltip> This is a private channel. </q-tooltip></q-icon
        >
      </q-item-label>
      <q-item-label class="conversation__summary" caption v-if="pending">
        Pending Invitation
      </q-item-label>
    </q-item-section>

    <div class="row" v-if="pending">
      <q-item-section side>
        <q-btn
          rounded
          color="green-8"
          icon="check"
          dense
          @click="(event) => handleInvitationClick(event, 'accept', channel!.id)"
        />
      </q-item-section>
      <q-item-section side>
        <q-btn
          rounded
          color="red-8"
          icon="close"
          dense
          @click="
            (event) => handleInvitationClick(event, 'decline', channel!.id)
          "
        />
      </q-item-section>
    </div>
    <q-item-section side v-else>
      <q-btn round icon="more_vert" flat dense />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { useChannelStore } from 'src/stores/channel-store';
import { useUserStore } from 'src/stores/user-store';
import { Channel } from './models';
import { useNotifications } from 'src/utils/useNotifications';

const userStore = useUserStore();
const channelStore = useChannelStore();
const { channel, pending } = defineProps({
  channel: Object,
  pending: Boolean,
});

// Handler for invitation response
const handleInvitationClick = (
  e: Event,
  decision: string,
  channelId: string
) => {
  console.log('Invitation Clicked');
  e.stopPropagation();

  if (decision === 'accept') {
    console.log('Accepting Invitation');
    channelStore.acceptInvitation(userStore.currentUserData!.id, channelId);
  } else {
    console.log('Declining Invitation');
    channelStore.declineInvitation(userStore.currentUserData!.id, channelId);
  }
};

// Switch to channel
const handleChannelClick = (channel: Channel) => {
  // If try to join channel while still being invited
  if (pending) {
    useNotifications('error', 'You are not a member of the channel yet');
    return;
  }
  // Set current channel
  channelStore.setCurrentActiveChannel(channel);
  channelStore.join(channel.name);
  channelStore.setActive(channel.name);
};
</script>
