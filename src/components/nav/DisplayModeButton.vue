<template>
  <button class="mode-switch-button" @click="switchMode" accesskey="l" :disabled="disabled || inTransit" aria-label="Switch to light or dark mode">
    <span class="fa fa-lightbulb-o" /> <!-- use fa-moon-o for dark mode -->
  </button>
</template>

<script>
export default {
  name: "DisplayModeButton",
  props: [ "baseUrl", "disabled", "theme" ],
  emits: [
    "updateServerMessage",
  ],
  watch: {
    '$auth.$isAuthenticated' (isAuthenticated) {
      if (isAuthenticated) {
        this.refreshModeSetting(); 
      } else {
        this.$theme.setupDefaultMode();
      }
    }
  },
  methods: {
    // 
    // server error 
    // 
    handleServerError(error) {
      console.error(error);
      if (error.name === 'TypeError') {
        this.setLastServerMessage('Something went wrong.  Please try again later.');
      } else if (error.message) {
        this.setLastServerMessage(error.message); 
      } else {
        this.setLastServerMessage(error); // $auth plugin errors 
      }
    },
    setLastServerMessage(message) {
      if (message) {
        this.$emit('updateServerMessage', message);
      }
    },
    // 
    switchMode() {
      this.$theme.switchMode();
      if (this.$auth.$isAuthenticated) {
        this.updateModeSetting();
      }
    },
    refreshModeSetting() {
      this.inTransit = true;
      this.$auth.getTokenSilently().then((token) => {
        const requestOptions = {
              headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              credentials: 'include' 
            };
        fetch(this.baseUrl + "/settings/display", requestOptions)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            return response.json().then(j => {throw new Error(j.message)})
          }
        }).then((data) => {
          if (data.displayMode) {
            this.$theme.setupMode(data.displayMode);
          }
        }).catch((error) => {
          this.handleServerError(error);
        }).finally(() => {
          this.inTransit = false;
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.isLoaded = false;
      });
    },
    updateModeSetting() {
      this.inTransit = true;
      this.$auth.getTokenSilently().then((token) => {
        const requestOptions = {
            method: 'PUT',
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ 
              frameworkConfig: { 
                display: { 
                  displayMode: this.$theme.currentTheme.ident 
                } 
              } 
            }),
            credentials: 'include' 
          };
        fetch(this.baseUrl + "/settings", requestOptions).then((response) => {
          if (response.status === 200) {
            return response.text(); 
          } else {
            return response.json().then(j => {throw new Error(j.message)})
          }
        }).catch((error) => {
          console.log(error);
          if (error.name === 'TypeError') {
            this.setLastServerMessage('Something went wrong saving your display mode.  Please try again later.');
          } else {
            this.setLastServerMessage(error.message);
          }
        }).finally(() => {
          this.inTransit = false;
        });
      }).catch((error) => {
        this.handleServerError(error);
      });
    }
  },
  data() {
    return {
      // 
      inTransit: false,
    }
  }
}
</script>

<style scoped>
.mode-switch-button {
  border: 1px solid v-bind('theme.buttonborder');
  background-color: v-bind('theme.buttonbg');
  color: v-bind('theme.buttonfg');
  box-shadow: 1px 1px 1px v-bind('theme.darkshadow');
  padding: .44rem 1.25rem;
  cursor: pointer;
  float: right;
  border-radius: 3px;
  margin: .56rem;
  text-align: center;
  min-width: 3rem;
  min-height: 3rem;
}

.mode-switch-button:disabled {
  cursor: auto;
}

.mode-switch-button:hover, .mode-switch-button:focus-visible {
  background-color: v-bind('theme.buttonhighlight');
}

.mode-switch-button:hover:disabled {
  background-color: unset;
}
</style>
