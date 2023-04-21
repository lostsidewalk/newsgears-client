<template>
  <button class="mode-switch-button accessible-button" 
    @click="switchMode" 
    accesskey="l" 
    :disabled="disabled || inTransit" 
    :title="this.$t('switchMode')"
    :aria-label="this.$t('switchModeAriaLabel')">
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
        this.refreshDisplaySettings(); 
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
        this.setLastServerMessage(this.$t('somethingHorribleHappened'));
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
    refreshDisplaySettings() {

      // this.$web.get("/settings/display")
      // .then((data) => {
      //   let displayConfig = data.displayConfig;
      //   if (displayConfig) {
      //     let themeConfig = data.themeConfig;
      //     this.$theme.setupModes(displayConfig.displayMode, themeConfig);
      //   }
      // });

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
          // server can return text or JSON object on success or error 
          let contentType = response.headers.get("content-type");
          let isJson = contentType && contentType.indexOf("application/json") !== -1;
          if (response.status === 200) {
            return isJson ? response.json() : {};
          } else {
            return isJson ? 
              response.json().then(j => {throw new Error(j.message + (j.details ? (': ' + j.details) : ''))}) : 
              response.text().then(t => {throw new Error(t)});
          }
        }).then((data) => {
          let displayConfig = data.displayConfig;
          if (displayConfig) {
            let themeConfig = data.themeConfig;
            this.$theme.setupModes(displayConfig.displayMode, themeConfig);
          }
        }).catch((error) => {
          this.handleServerError(error);
        }).finally(() => {
          this.inTransit = false;
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.inTransit = false;
      });
    },
    updateModeSetting() {

      // this.$web.put("/settings/display", JSON.stringify({ 
      //   frameworkConfig: { 
      //     display: { 
      //       displayMode: this.$theme.currentTheme.ident 
      //     } 
      //   } 
      // }));

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
            return;
          } else {
            let contentType = response.headers.get("content-type");
            let isJson = contentType && contentType.indexOf("application/json") !== -1;
            return isJson ? 
              response.json().then(j => {throw new Error(j.message + (j.details ? (': ' + j.details) : ''))}) : 
              response.text().then(t => {throw new Error(t)});
          }
        }).catch((error) => {
          this.handleServerError(error);
        }).finally(() => {
          this.inTransit = false;
        });
      }).catch((error) => {
        this.handleServerError(error);
        this.inTransit = false;
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
  border-radius: 4px;
  margin: .56rem;
  text-align: center;
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
