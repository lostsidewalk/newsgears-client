import { useI18n } from "vue-i18n"

export function usePosts() {

    const { t } = useI18n();

    function formatStatus(postStatus) {
        let token = null;
        if (postStatus === 'READ') {
            token = 'read';
        } else if (postStatus === 'READ_LATER') {
            token = 'readLater';
        } else {
            token = 'unread';
        }
        return t(token);
    }

    return {
        formatStatus,
    }
}
