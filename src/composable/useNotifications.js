import { ref, inject, readonly } from 'vue';
import { useAnnouncer } from '@vue-a11y/announcer';
import { useI18n } from 'vue-i18n';
import { useNotificationStore } from '@/composable/useNotificationStore.js';


export function useNotifications() {
  const { t } = useI18n();
  const vue3NativeNotifications = inject('vue3NativeNotifications');
  const { polite } = useAnnouncer();
  const showNotificationWarning = ref(false);
  const notificationStore= useNotificationStore();
  // 
  // handleserver error 
  // 
  function handleServerError(error) {
    console.error(error);
    if (error.name === 'TypeError') {
      setLastServerMessage(t('somethingHorribleHappened'));
    } else if (error.name === 'AbortError') {
      setLastServerMessage(t('requestTimedOut'));
    } else {
      setLastServerMessage(error.message || error);
    }
  }

  async function setLastServerMessage(message) {
    const permission = await vue3NativeNotifications.requestPermission();
    if (permission === "granted") {
      showNotificationWarning.value = false;
      vue3NativeNotifications.show('Newsgears message', {
        body: message
      }, {
        onerror: () => {
          console.error("unable to show notification, message=" + message);
        }
      });
      polite(message);
    } else {
      showNotificationWarning.value = true;
    }
  }

  function shouldShowAlert(alertName) {
    return !localStorage.getItem(alertName); 
  }

  function dismissAlert(alertName) {
    localStorage.setItem(alertName, new Date().toISOString())
  }

  const roShowNotificationWarning = readonly(showNotificationWarning);

  function consoleLog(message) {
    console.log(message);
    notificationStore.addMessage(message);
  }

  function consoleError(message) {
    console.error(message);
    notificationStore.addError(message);
  }

  return {
    notificationStore,
    // 
    roShowNotificationWarning, 
    // 
    handleServerError, 
    setLastServerMessage,
    shouldShowAlert, 
    dismissAlert, 
    consoleLog,
    consoleError,
  }
}
