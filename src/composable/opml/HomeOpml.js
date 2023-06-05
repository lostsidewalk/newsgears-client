import { ref, reactive, inject } from 'vue';
import { useI18n } from 'vue-i18n';

export function useOpml(props) {
  const auth = inject('auth');
  const { t } = useI18n();
  const continueIsLoading = ref(false);
  const atStep2 = ref(false);
  const queueConfigRequests = reactive([]);
  const opmlErrors = reactive([]);

  const { baseUrl } = props;

  function continueOpmlUpload(opmlFiles) {
    continueIsLoading.value = true;
    opmlErrors.splice(0);
    auth.getTokenSilently().then((token) => {
      // form data 
      let formData = new FormData();
      for (let i = 0; i < opmlFiles.length; i++) {
        let f = opmlFiles[i];
        formData.append('files', f.file, f.file.name);
      }
      // request options 
      const controller = new AbortController();
      const requestOptions = {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include',
        body: formData,
        signal: controller.signal
      };
      const timeoutId = setTimeout(() => controller.abort(), 45000);
      fetch(baseUrl + "/queues/opml", requestOptions)
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
          if (data.errors && data.errors.length > 0) {
            Object.assign(opmlErrors, data.errors);
          } else {
            Object.assign(queueConfigRequests, data.queueConfigRequests);
            atStep2.value = true;
          }
        }).catch((error) => {
          console.error(error);
          if (error.name === 'TypeError') {
            opmlErrors.push(t('somethingHorribleHappened'));
          } else if (error.name === 'AbortError') {
            opmlErrors.push(t('requestTimedOut'));
          } else {
            opmlErrors.push(error.message);
          }
        }).finally(() => {
          continueIsLoading.value = false;
          clearTimeout(timeoutId);
        });
    }).catch((error) => {
      if (error.name === 'TypeError') {
        opmlErrors.push(t('somethingHorribleHappened'));
      } else if (error.name === 'AbortError') {
        opmlErrors.push(t('requestTimedOut'));
      } else {
        opmlErrors.push(error.message);
      }
      continueIsLoading.value = false;
    });
  }

  return {
    continueIsLoading, 
    atStep2, 
    queueConfigRequests, 
    opmlErrors, 
    continueOpmlUpload, 
  }
}