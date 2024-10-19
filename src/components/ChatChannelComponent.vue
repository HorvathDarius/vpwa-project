<template>
  <q-item dark clickable v-ripple class="q-pa-md">
    <q-item-section>
      <q-item-label lines="1" class="text-bold">
        {{ channel?.name }}
        <q-icon
          v-if="channel?.type === 'private'"
          name="lock_person"
          class="q-ml-xs"
        />
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

const userStore = useUserStore();
const channelStore = useChannelStore();
const { channel } = defineProps({
  channel: Object,
  pending: Boolean,
});

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
</script>
