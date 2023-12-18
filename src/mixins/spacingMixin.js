export default {
    computed: {
        // pa 
        pa4r() {
            return 'pa-' + this.four;
        },
        // ma 
        ma4r() {
            return 'ma-' + this.four;
        },
        // mb
        mb4r() {
            return 'mb-' + this.four;
        },
        mb16r() {
            return 'mb-' + this.sixteen;
        },
        // mt 
        mt4r() {
            return 'mt-' + this.four;
        },
        mt8r() {
            return 'mt-' + this.eight;
        },
        // my 
        my4r() {
            return 'my-' + this.four;
        },
        my10r() {
            return 'my-' + this.sixteen;
        },
        my12r() {
            return 'my-' + this.twelve;
        },
        // 
        four() {
            if (this.$vuetify.display.xs) {
                return '2';
            } else if (this.$vuetify.display.sm) {
                return '3';
            } else {
                return '4';
            }
        },
        eight() {
            if (this.$vuetify.display.xs) {
                return '2';
            } else if (this.$vuetify.display.sm) {
                return '5';
            } else {
                return '8';
            }
        },
        ten() {
            if (this.$vuetify.display.xs) {
                return '2';
            } else if (this.$vuetify.display.sm) {
                return '6';
            } else {
                return '10';
            }
        },
        twelve() {
            if (this.$vuetify.display.xs) {
                return '4';
            } else if (this.$vuetify.display.sm) {
                return '8';
            } else {
                return '12';
            }
        },
        sixteen() {
            if (this.$vuetify.display.xs) {
                return '8';
            } else if (this.$vuetify.display.sm) {
                return '12';
            } else {
                return '16';
            }
        }
    },
  };
  
  