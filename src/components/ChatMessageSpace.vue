<template>
  <q-page-container class="col">
    <q-page class="column">
      <div class="position-relative full-height">
        <div class="absolute-full">
          <div
            ref="scrollContainer"
            style="height: 85%; overflow: auto"
            v-if="channelStore.channelState.active"
          >
            <q-infinite-scroll
              v-if="channelStore.channelState.active"
              reverse
              :offset="300"
              class="q-px-lg q-pt-lg"
              @load="loadMoreMessages"
            >
              <template v-slot:loading>
                <div class="row justify-center q-my-md" v-if="hasMoreMessages">
                  <q-spinner-dots color="primary" size="40px" />
                </div>
              </template>

              <div>
                <q-chat-message
                  v-for="(message, index) in messages[
                    channelStore.channelState.active
                  ]"
                  :sent="message.createdBy === userStore.authInfo.user?.id"
                  :class="
                    message.createdBy === userStore.authInfo.user?.id
                      ? 'text-blue-3'
                      : 'text-grey-1'
                  "
                  :key="index"
                  :name="
                    message.createdBy === userStore.authInfo.user?.id
                      ? userStore.authInfo.user?.nickName
                      : channelStore.activeChannelsMembers.find(
                          (member) => member.id === message.createdBy
                        )?.nickName
                  "
                  :avatar="
                    message.createdBy === userStore.authInfo.user?.id
                      ? '/blankProfileReverse.jpg'
                      : '/blankProfile.jpg'
                  "
                  :text="[message.content as any]"
                  :stamp="message.createdAt"
                  :bg-color="
                    message.createdBy === userStore.authInfo.user?.id
                      ? 'blue-4'
                      : message.mentions === userStore.authInfo.user?.id
                      ? 'orange-4'
                      : 'grey-4'
                  "
                />

                <q-chat-message
                  v-if="
                    // If there is a message being typed
                    channelStore.currentlyTyping !== null &&
                    // And the active channel is the emitting channel
                    channelStore.currentlyTyping.channel ===
                      channelStore.channelState.active
                  "
                  class="text-grey-1"
                  :name="`${channelStore.currentlyTyping.username} is typing...`"
                  bg-color="grey-5"
                >
                  <div @click="handleMouseClick">
                    <q-spinner-dots v-if="!showTypingMessage" size="2rem" />
                    <span v-else>{{
                      channelStore.currentlyTyping.message
                    }}</span>
                  </div>
                </q-chat-message>
              </div>
            </q-infinite-scroll>

            <div
              v-else
              style="height: 100%"
              class="column q-pa-lg justify-center items-center text-center"
            >
              <p class="text-h5 text-white text-weight-bold">
                Oh no... Looks like this channel is empty
              </p>
              <p class="text-h6 text-blue-grey-5">
                Start typing to send a message...
              </p>
            </div>
          </div>

          <div
            v-else
            style="height: 85%"
            class="column q-pa-md justify-center items-center text-center"
          >
            <p class="text-h5 text-white text-weight-bold">
              WELCOME TO OUR CHATTING APPLICATION
            </p>

            <p class="text-h6 text-blue-grey-5">
              Select a channel to start chatting...
            </p>
            <p class="text-h6 text-blue-grey-5">
              Or type '/' to see available commands...
            </p>
          </div>

          <div style="height: 15%; display: flex; align-items: center">
            <ChatFooter />
          </div>
        </div>
      </div>

      <q-page-scroller reverse position="top" :scroll-offset="100">
        <q-btn elevated rounded color="primary" label="Scroll back down..." />
      </q-page-scroller>
    </q-page>
  </q-page-container>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import ChatFooter from './ChatFooter.vue';
import { useChannelStore } from 'src/stores/channel-store';
import { useUserStore } from 'src/stores/user-store';

const scrollContainer = ref<HTMLElement | null>(null);
const hasMoreMessages = ref(true);
const showTypingMessage = ref(false);
const channelStore = useChannelStore();
const userStore = useUserStore();
const messages = channelStore.channelState.messages;

// This function was created with help of chatGPT
const loadMoreMessages = async (index: number, done: () => void) => {
  const delay = 1000; // Timeout in milliseconds
  if (!scrollContainer.value) {
    done();
    return;
  }

  try {
    const previousScrollHeight = scrollContainer.value.scrollHeight;

    // Wait for the specified timeout before fetching messages
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Fetch messages after the delay
    const moreMessages = await channelStore.loadMoreMessages(
      channelStore.channelState.active!,
      index
    );

    hasMoreMessages.value = moreMessages;

    // Wait for DOM updates
    await nextTick();

    // Adjust scroll position to prevent jumping
    adjustScrollPosition(previousScrollHeight);

    // Mark the load cycle as done
    done();
  } catch (error) {
    console.error('Error loading messages:', error);

    // Ensure the infinite scroll doesn't get stuck
    done();
  }
};

// This function was created with help of chatGPT
const adjustScrollPosition = (previousScrollHeight: number) => {
  if (scrollContainer.value) {
    const currentScrollHeight = scrollContainer.value.scrollHeight;
    const heightDifference = currentScrollHeight - previousScrollHeight;
    scrollContainer.value.scrollTop += heightDifference;
  }
};

const handleMouseClick = () => {
  showTypingMessage.value = !showTypingMessage.value;
};
</script>
