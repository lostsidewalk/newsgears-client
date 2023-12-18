import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notificationStore', {
  state: () => ({
    messages: [],
    capacity: 512,
  }),
  getters: {
    allMessages: (state) => {
      return state.messages;
    },
  },
  actions: {
    addMessage(message) {
      this.circularPush(new Date().toLocaleString() + ': ' + message);
    },
    addError(message) {
      // TODO: segregate messages/errors in some way 
      this.circularPush(new Date().toLocaleString() + ': ' + message);
    },
    circularPush(message) {
      if (this.messages.length < this.capacity) {
        this.messages.push(message);
      } else {
        this.messages.shift();
        this.messages.push(message);
      }
    },
  },
});
