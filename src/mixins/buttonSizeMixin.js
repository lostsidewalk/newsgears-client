export default {
  computed: {
    buttonSize() {
      if (this.$vuetify.display.xs) {
        return 'x-small';
      } else { // if (this.$vuetify.display.sm) {
        return 'small';
      // } else if (this.$vuetify.display.md) {
      //   return 'medium';
      // } else if (this.$vuetify.display.lg) {
      //   return 'large';
      // } else if (this.$vuetify.display.xl || this.$vuetify.display.xxl) {
      //   return 'x-large';
      // } else {
      //   return 'medium';
      }
    },
  },
};
