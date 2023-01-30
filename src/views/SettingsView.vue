<template>
  <div id="home">
    <!-- fixed header -->
    <NavbarFixedHeader :theme="theme">
      <template v-slot:buttons>
        <NavbarButtons :disableSettings="true" :inTransit="inTransit" :theme="theme" />
      </template>
    </NavbarFixedHeader>
    <!-- fixed subheader -->
    <transition appear enter-active-class="animated fadeIn">
      <NavbarFixedSubheader v-if="this.serverMessages.length > 0" :theme="theme" :inTransit="inTransit">
        <template v-slot:message>
          <LastServerMessage :serverMessages="this.serverMessages" @clearLastServerMessage="this.clearLastServerMessage" :theme="theme"/>
        </template>
      </NavbarFixedSubheader>
    </transition>
    <!-- settings panel -->
    <div v-if="this.$auth.$isAuthenticated">
      <SettingsPanel ref="settings" 
        v-if="this.isLoaded"
        :account="this.account"
        :frameworkConfig="this.frameworkConfig"
        @settingsUpdated="updateSettings" 
        @exportOpml="exportOpml"
        @deactivateAccount="deactivateAccount"
        @initPasswordReset="initPasswordReset"
        :theme="theme"
        :inTransit="inTransit" />
      <!-- "go back" link -->
      <GoBack :theme="theme" />
    </div>
    <YouHaveBeenLoggedOut v-if="!this.forceLogout && !this.$auth.$isAuthenticated" :theme="theme" />
  </div>
</template>

<script>
import NavbarFixedHeader from "@/components/layout/NavbarFixedHeader.vue";
import NavbarButtons from "@/components/layout/NavbarButtons.vue";
import NavbarFixedSubheader from "@/components/layout/NavbarFixedSubheader.vue";
import LastServerMessage from "@/components/layout/LastServerMessage.vue";
import SettingsPanel from "@/components/settings/SettingsPanel.vue";
import YouHaveBeenLoggedOut from "@/components/auth/YouHaveBeenLoggedOut.vue";
import GoBack from "@/components/layout/GoBack.vue";

export default {
  name: "SettingsView",
  components: {
    NavbarFixedHeader,
    NavbarButtons,
    NavbarFixedSubheader,
    LastServerMessage,
    SettingsPanel,
    YouHaveBeenLoggedOut,
    GoBack,
},
  props: ["baseUrl"],
  mounted() {
    console.log("settings_page: mounted... baseUrl=" + this.baseUrl);
    this.refreshSettings();
  },
  methods: {
    setLastServerMessage(message) {
      this.clearLastServerMessage();
      let serverMessageId = Math.random();
      this.serverMessages.push({
        timestamp: new Date(),
        id: serverMessageId,
        text: message 
      });
      setTimeout(() => {
        let idxToSplice = -1;
        for(let i = 0; i < this.serverMessages.length; i++) {
          if (this.serverMessages[i].id == serverMessageId) {
            idxToSplice = i;
            break;
          }
        }
        if (idxToSplice >= 0) {
          this.serverMessages.splice(idxToSplice, 1);
        }
      }, 6000);
    },
    clearLastServerMessage() {
      this.serverMessages.pop();
    },
    refreshSettings() {
      this.inTransit = true;
      this.$auth.getTokenSilently().then((token) => {
        const requestOptions = {
              headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              credentials: 'include' 
            };
        fetch(this.baseUrl + "/settings", requestOptions)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            return response.json().then(j => {throw new Error(j.message)})
          }
        }).then((data) => {
          this.account = {
            username: data.username,
            emailAddress: data.emailAddress,
            authProvider: data.authProvider,
            authProviderProfileImgUrl: data.authProviderProfileImgUrl,
            authProviderUsername: data.authProviderUsername
          }
          this.frameworkConfig = data.frameworkConfig;
          this.isLoaded = true;
        }).catch((error) => {
          console.log(error);
          if (error.name === 'TypeError') {
            this.setLastServerMessage('Something went wrong.  Please try again later.');
          } else {
            this.setLastServerMessage(error.message);
          }
          this.isLoaded = false;
        }).finally(() => {
          this.inTransit = false;
        })
      });
    },
    updateSettings(newSettings) {
      try {
        if (newSettings.emailAddress && newSettings.emailAddress.length > 512) {
          throw Error("");
        }
      } catch (error) {
        console.log(error);
        return;
      }
      console.log("updateSettings, newSettings=" + JSON.stringify(newSettings));
      this.inTransit = true;
      this.$auth.getTokenSilently().then((token) => {
        const requestOptions = {
            method: 'PUT',
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(newSettings),
            credentials: 'include' 
          };
        fetch(this.baseUrl + "/settings", requestOptions).then((response) => {
          if (response.status === 200) {
            return response.text(); // TODO: correct this; should be a JSON object 
          } else {
            return response.json().then(j => {throw new Error(j.message)})
          }
        }).then(() => {
          // TODO: set the account obj properties from the JSON response object (above) 
          if (newSettings.username) {
            this.account.username = newSettings.username;
          }
          if (newSettings.emailAddress) {
            this.account.emailAddress = newSettings.emailAddress;
          }
          if (newSettings.frameworkConfig) {
            this.frameworkConfig = newSettings.frameworkConfig;
          }
          this.setLastServerMessage("Settings updated.");
        }).catch((error) => {
          console.log(error);
          if (error.name === 'TypeError') {
            this.setLastServerMessage('Something went wrong.  Please try again later.');
          } else {
            this.setLastServerMessage(error.message);
          }
        }).finally(() => {
          this.inTransit = false;
        })
      });
    },
    exportOpml() {
      this.inTransit = true;
      this.$auth.getTokenSilently().then((token) => {
        const requestOptions = {
            method: 'GET',
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            credentials: 'include' 
          };
        fetch(this.baseUrl + "/feeds/opml", requestOptions).then((response) => {
          if (response.status === 200) {
            return response.blob();
          } else {
            return response.json().then(j => {throw new Error(j.message)})
          }
        }).then((blob) => {
          let url = window.URL.createObjectURL(blob);
          let anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = 'feedgears-opml-export.xml';
          document.body.appendChild(anchor);
          anchor.click();
          anchor.remove();
          this.setLastServerMessage("OPML export downloaded.");
        }).catch((error) => {
          console.log(error);
          if (error.name === 'TypeError') {
            this.setLastServerMessage('Something went wrong.  Please try again later.');
          } else {
            this.setLastServerMessage(error.message);
          }
        }).finally(() => {
          this.inTransit = false;
        })
      });
    },
    deactivateAccount() {
      this.inTransit = true;
      this.$auth.getTokenSilently().then((token) => {
        const requestOptions = {
            method: 'DELETE',
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            credentials: 'include' 
          };
        fetch(this.baseUrl + "/deregister", requestOptions).then((response) => {
          if (response.status === 200) {
            return response.blob();
          } else {
            return response.json().then(j => {throw new Error(j.message)})
          }
        }).catch((error) => {
          console.log(error);
          if (error.name === 'TypeError') {
            this.setLastServerMessage('Something went wrong.  Please try again later.');
          } else {
            this.setLastServerMessage(error.message);
          }
        }).finally(() => {
          this.inTransit = false;
          this.forceLogout = true;
          this.$auth.tearDownLoggedInSession();
          this.$router.push("/app");
        });
      });
    },
    initPasswordReset() {
      this.inTransit = true;
      this.$auth
        .pwResetWithSupplied(this.account.username, this.account.emailAddress)
        .then(() => {
          this.setLastServerMessage("Check your email to further instructions.");
        })
        .catch((error) => {
          this.setLastServerMessage(error);
        })
        .finally(() => {
          this.inTransit = false;
        });
    },
  },
  data() {
      return {
        account: null,
        frameworkConfig: null,
        theme: this.$theme.currentTheme,
        inTransit: true,
        serverMessages: [],
        isLoaded: false,
        forceLogout: false,
      };
  },
};
</script>

<style scoped>
#home {
  background-color: v-bind('theme.appbg');
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
  margin-left: 3%;
  margin-right: 3%;
}
</style>
