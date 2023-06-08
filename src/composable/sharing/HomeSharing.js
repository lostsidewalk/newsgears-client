import { computed } from 'vue';

export function useSharing() {
  const sharingOptions = computed(() => {
    return [
      {
        name: 'twitter',
        icon: 'twitter',
        url: 'https://twitter.com/intent/tweet?text={TITLE}&url={URL}',
      },
      {
        name: 'facebook',
        icon: 'facebook',
        url: 'http://www.facebook.com/share.php?u={URL}&title={TITLE}',
      },
      {
        name: 'telegram',
        icon: 'telegram',
        url: 'https://telegram.me/share/url?url={URL}&t={TITLE}',
      },
      {
        name: 'linkedIn',
        icon: 'linkedin',
        url: 'http://www.linkedin.com/shareArticle?mini=true&url={URL}&title={TITLE}&source={SOURCE}',
      },
      {
        name: 'blogger',
        icon: 'rss', // kind of generic 
        url: 'https://www.blogger.com/blog-this.g?n={TITLE}&t={CONTENT}&u={URL}',
      },
    ];
  });

  function share(sharingOption, post) {
    const { postTitle, postUrl, importerDesc, postDesc } = post;
    const title = encodeURIComponent(postTitle.value);
    const link = encodeURIComponent(postUrl);
    const source = encodeURIComponent(importerDesc);
    const content = encodeURIComponent(postDesc ? postDesc.value : '');
    const url = replaceArray(sharingOption.url,
      ["{URL}", "{TITLE}", "{SOURCE}", "{CONTENT}"],
      [link, title, source, content]
    );
    window.open(url, '_blank');
  }
  
  function replaceArray(str, find, replace) {
    let replaceString = str;
    let regex;
    for (let i = 0; i < find.length; i++) {
      regex = new RegExp(find[i], "g");
      replaceString = replaceString.replace(regex, replace[i]);
    }
    return replaceString;
  }

  return {
    sharingOptions, 
    // 
    share,
  }
}
