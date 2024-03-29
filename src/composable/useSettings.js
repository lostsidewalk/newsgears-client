import { ref, reactive, inject, readonly } from 'vue';
import { useRouter} from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useNotifications } from '@/composable/useNotifications';

export function useSettings(props) {
  const auth = inject('auth');
  const { router } = useRouter();
  const { t } = useI18n();
  const { 
    handleServerError, 
    setLastServerMessage 
  } = useNotifications();
  const settingsIsLoading = ref(false);
  const showSettingsPanel = ref(false);
  const account = reactive({});

  const { baseUrl } = props;

  function openSettings() {
    settingsIsLoading.value = true;
    auth.getTokenSilently().then((token) => {
      const controller = new AbortController();
      const requestOptions = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include',
        signal: controller.signal
      };
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      fetch(baseUrl + "/settings", requestOptions)
        .then((response) => {
          let contentType = response.headers.get("content-type");
          let isJson = contentType && contentType.indexOf("application/json") !== -1;
          if (response.status === 200) {
            return isJson ? response.json() : {};
          } else {
            return isJson ?
              response.json().then(j => { throw new Error(j.message + (j.details ? (': ' + j.details) : '')) }) :
              response.text().then(t => { throw new Error(t) });
          }
        }).then((data) => {
          Object.keys(account).forEach((key) => {
            delete account[key];
          });
          Object.assign(account, {
            username: data.username,
            emailAddress: data.emailAddress,
            authProvider: data.authProvider,
            authProviderProfileImgUrl: data.authProviderProfileImgUrl,
            authProviderUsername: data.authProviderUsername,
            frameworkConfig: data.frameworkConfig, 
          })
          showSettingsPanel.value = true;
        }).catch((error) => {
          handleServerError(error);
          settingsIsLoading.value = false; // top-level 
        }).finally(() => {
          settingsIsLoading.value = false; // top-level 
          clearTimeout(timeoutId);
        });
    }).catch((error) => {
      handleServerError(error);
      settingsIsLoading.value = false; // top-level
    });
  }
  
  function updateNotificationPreferences(updateNotificationRequest) {
    let enableAccountAlerts = updateNotificationRequest.enableAccountAlerts;
    let newSettings = {
      frameworkConfig: {
        notifications: {
          accountAlerts: enableAccountAlerts,
        }
      }
    };
    settingsIsLoading.value = true;
    auth.getTokenSilently().then((token) => {
      const controller = new AbortController();
      const requestOptions = {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newSettings),
        credentials: 'include',
        signal: controller.signal
      };
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      fetch(baseUrl + "/settings", requestOptions).then((response) => {
        if (response.status === 200) {
          return;
        } else {
          let contentType = response.headers.get("content-type");
          let isJson = contentType && contentType.indexOf("application/json") !== -1;
          return isJson ?
            response.json().then(j => { throw new Error(j.message + (j.details ? (': ' + j.details) : '')) }) :
            response.text().then(t => { throw new Error(t) });
        }
      }).then(() => {
        // TODO: (enhancement) set the account obj properties from the JSON response object (above) 
        if (newSettings.username) {
          account.username = newSettings.username;
        }
        if (newSettings.emailAddress) {
          account.emailAddress = newSettings.emailAddress;
        }
        if (newSettings.frameworkConfig) {
          if (!account.frameworkConfig) {
            account.frameworkConfig = {};
          }
          Object.assign(account.frameworkConfig, newSettings.frameworkConfig);
        }
        setLastServerMessage(t('settingsUpdated'));
      }).catch((error) => {
        handleServerError(error);
      }).finally(() => {
        clearTimeout(timeoutId);
        settingsIsLoading.value = false;
      });
    }).catch((error) => {
      handleServerError(error);
      settingsIsLoading.value = false;
    });
  }

  function exportOpml() {
    settingsIsLoading.value = true;
    auth.getTokenSilently().then((token) => {
      const controller = new AbortController();
      const requestOptions = {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include',
        signal: controller.signal
      };
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      fetch(baseUrl + "/queues/opml", requestOptions).then((response) => {
        if (response.status === 200) {
          return response.blob();
        } else {
          let contentType = response.headers.get("content-type");
          let isJson = contentType && contentType.indexOf("application/json") !== -1;
          return isJson ?
            response.json().then(j => { throw new Error(j.message + (j.details ? (': ' + j.details) : '')) }) :
            response.text().then(t => { throw new Error(t) });
        }
      }).then((blob) => {
        let url = window.URL.createObjectURL(blob);
        let anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'newsgears-opml-export.xml';
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        setLastServerMessage(t('opmlExportDownloaded'));
      }).catch((error) => {
        handleServerError(error);
      }).finally(() => {
        clearTimeout(timeoutId);
        settingsIsLoading.value = false;
      });
    }).catch((error) => {
      handleServerError(error);
      settingsIsLoading.value = false;
    });
  }

  function finalizeDeactivation() {
    settingsIsLoading.value = true;
    auth.getTokenSilently().then((token) => {
      const controller = new AbortController();
      const requestOptions = {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include',
        signal: controller.signal
      };
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      fetch(baseUrl + "/deregister", requestOptions).then((response) => {
        if (response.status === 200) {
          return response.blob();
        } else {
          let contentType = response.headers.get("content-type");
          let isJson = contentType && contentType.indexOf("application/json") !== -1;
          return isJson ?
            response.json().then(j => { throw new Error(j.message + (j.details ? (': ' + j.details) : '')) }) :
            response.text().then(t => { throw new Error(t) });
        }
      }).catch((error) => {
        handleServerError(error);
      }).finally(() => {
        clearTimeout(timeoutId);
        settingsIsLoading.value = false;
        auth.tearDownLoggedInSession();
        router.value.push("/login");
      });
    }).catch((error) => {
      handleServerError(error);
      settingsIsLoading.value = false;
    });
  }

  function initPasswordReset() {
    settingsIsLoading.value = true;
    auth.pwResetWithSupplied(account.username, account.emailAddress)
      .then(() => {
        setLastServerMessage(t('checkEmailForFurther'));
      })
      .catch((error) => {
        handleServerError(error);
      })
      .finally(() => {
        settingsIsLoading.value = false;
      });
  }

  function toggleNotifications(toggleNotificationsRequest) {
    let notificationsDisabled = toggleNotificationsRequest.notificationsDisabled;
    let enableAccountAlerts = toggleNotificationsRequest.enableAccountAlerts;
    let newSettings = {
      frameworkConfig: {
        notifications: {
          disabled: notificationsDisabled,
          accountAlerts: enableAccountAlerts,
        }
      }
    };
    settingsIsLoading.value = true;
    auth.getTokenSilently().then((token) => {
      const controller = new AbortController();
      const requestOptions = {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newSettings),
        credentials: 'include',
        signal: controller.signal
      };
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      fetch(baseUrl + "/settings", requestOptions).then((response) => {
        if (response.status === 200) {
          return;
        } else {
          let contentType = response.headers.get("content-type");
          let isJson = contentType && contentType.indexOf("application/json") !== -1;
          return isJson ?
            response.json().then(j => { throw new Error(j.message + (j.details ? (': ' + j.details) : '')) }) :
            response.text().then(t => { throw new Error(t) });
        }
      }).then(() => {
        // TODO: (enhancement) set the account obj properties from the JSON response object (above) 
        if (newSettings.username) {
          account.username = newSettings.username;
        }
        if (newSettings.emailAddress) {
          account.emailAddress = newSettings.emailAddress;
        }
        if (newSettings.frameworkConfig) {
          if (!account.frameworkConfig) {
            account.frameworkConfig = {};
          }
          Object.assign(account.frameworkConfig, newSettings.frameworkConfig);
        }
        setLastServerMessage(t('settingsUpdated'));
      }).catch((error) => {
        handleServerError(error);
      }).finally(() => {
        clearTimeout(timeoutId);
        settingsIsLoading.value = false;
      });
    }).catch((error) => {
      handleServerError(error);
      settingsIsLoading.value = false;
    });
  }

  function updateAccount(updateAccountRequest) {
    let emailAddress = updateAccountRequest.emailAddress;
    let newSettings = {
      emailAddress: emailAddress
    };
    settingsIsLoading.value = true;
    auth.getTokenSilently().then((token) => {
      const controller = new AbortController();
      const requestOptions = {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newSettings),
        credentials: 'include',
        signal: controller.signal
      };
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      fetch(baseUrl + "/settings", requestOptions).then((response) => {
        if (response.status === 200) {
          return;
        } else {
          let contentType = response.headers.get("content-type");
          let isJson = contentType && contentType.indexOf("application/json") !== -1;
          return isJson ?
            response.json().then(j => { throw new Error(j.message + (j.details ? (': ' + j.details) : '')) }) :
            response.text().then(t => { throw new Error(t) });
        }
      }).then(() => {
        // TODO: (enhancement) set the account obj properties from the JSON response object (above) 
        if (newSettings.emailAddress) {
          account.emailAddress = newSettings.emailAddress;
        }
        setLastServerMessage(t('settingsUpdated'));
      }).catch((error) => {
        handleServerError(error);
      }).finally(() => {
        settingsIsLoading.value = false;
        clearTimeout(timeoutId);
      });
    }).catch((error) => {
      handleServerError(error);
      settingsIsLoading.value = false;
    });
  }

  const roAccount = readonly(account);
  const roSettingsIsLoading = readonly(settingsIsLoading);

  return {
    roAccount,
    roSettingsIsLoading, 
    // 
    showSettingsPanel, // rw
    // 
    openSettings, 
    updateNotificationPreferences, 
    exportOpml,
    finalizeDeactivation,
    initPasswordReset,
    toggleNotifications,
    updateAccount, 
  }
}
