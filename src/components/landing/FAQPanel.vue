<template>
  <div class="faq-view">
    <!-- what is RSS/ATOM -->
    <v-container class="d-flex flex-row flex-wrap justify-center">
      <v-card class="ma-2" elevation="6" variant="tonal">
        <v-card-item>
          <v-card-title class="question-verbiage">What is RSS/ATOM?</v-card-title>
        </v-card-item>
        <v-card-text class="answer" align="left">

          <v-img class="mb-4" src="the_power_of_rss.gif" max-height="512" />

          <p class="mb-2">RSS (Really Simple Syndication) is a web feed format used for publishing frequently updated content such as blog entries, news headlines, audio, and video. It was first introduced by Netscape in 1999 as an XML-based format for syndicating content from news sites and blogs.</p>
          
          <p class="mb-2">RSS allows users to subscribe to content feeds using a web feed reader or aggregator, which can automatically retrieve and display new content from multiple sources in a single location. This makes it easier for users to stay up-to-date on their favorite websites and content creators without having to manually check each site for updates.</p>
          
          <p class="mb-2">FeedGears is both an RSS aggregator and an RSS reader.</p>
          
          <p class="mb-2">Over the years, RSS has evolved and several versions of the protocol have been released, including 
            <a href="https://www.rssboard.org/rss-0-9-0">RSS 0.90</a>, 
            <a href="https://www.rssboard.org/rss-0-9-1-netscape">RSS 0.91</a>, 
            <a href="https://web.resource.org/rss/1.0/">RSS 1.0</a>, 
            <a href="https://www.rssboard.org/rss-specification">RSS 2.0</a>, and 
            <a href="http://www.aaronsw.com/2002/rss30">RSS 3.0</a>. Each version added new features and functionality, such as support for multimedia content and enclosures.</p>
          
          <p class="mb-2"><a href="http://www.atomenabled.org/">Atom</a>, on the other hand, is a similar web feed format that was introduced in 2003 as an alternative to RSS. Like RSS, Atom is an XML-based format that allows publishers to syndicate content such as blog posts, news articles, and podcasts.</p>
          
          <p class="mb-2">One of the key differences between RSS and Atom is that Atom is a standardized format, while RSS has multiple versions and variations. Additionally, Atom is designed to be more extensible and flexible than RSS, allowing for easier customization and support for additional metadata.</p>
          
          <p class="mb-2">Overall, RSS and Atom have played an important role in the evolution of web content syndication and have helped to make it easier for users to access and consume the content they care about.</p>
          
          <ul class="ma-2">
            <li><a href="https://aboutfeeds.com/">About Feeds</a></li>
            <li><a href="https://en.wikipedia.org/wiki/RSS">Wikipedia: RSS</a></li>
            <li><a href="https://meganesulli.com/blog/how-rss-works">An Intro to RSS Feeds</a></li>
            <li><a href="https://www.youneedfeeds.com/">You Need Feeds</a></li>
            <li><a href="https://huey.xyz/posts/2021-07-18-rss">Why you should consider using RSS</a></li>
            <li><a href="https://ncase.me/rss/">Back to the Future with RSS</a></li>
          </ul>
          
          <ul class="ma-2">
            <li><a href="https://www.ruanyifeng.com/blog/2006/01/rss.html">如何使用 RSS</a></li>
            <li><a href="https://xuchi.name/117/">RSS 是干什么的？</a></li>
            <li><a href="https://mp.weixin.qq.com/s/KKPO3otk5LBeLMQTtlqHvg">RSS 订阅傻瓜式教程</a></li>
            <li><a href="https://sspai.com/post/56198">RSS - 高效率的阅读方式</a></li>
            <li><a href="https://zhuanlan.zhihu.com/p/109813899">RSS 工具和应用场景</a></li>
          </ul>
        </v-card-text>
      </v-card>
    </v-container>

    <!-- RSS Made Easy! (video) -->
    <v-container align="center">
      <v-card class="ma-2" elevation="6" variant="tonal">
        <v-card-item>
          <v-card-title class="question-verbiage">RSS Made Easy</v-card-title>
        </v-card-item>
        <div class="answer">
          <vue-plyr style="width: 100%;height: auto;">
            <div class="plyr__video-embed">
              <iframe
                src="https://www.youtube.com/watch?v=6HNUqDL-pI8"
                allowfullscreen
                allowtransparency
                allow="autoplay" />
            </div>
          </vue-plyr>
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "FAQPanel",
  props: ["theme"],
}
</script>

<style scoped>
.faq-view {
  border-top: 1px solid v-bind('theme.navbarsubshadow');
}

.question-verbiage {
  font-family: "Russo One", system-ui, sans-serif;
  color: v-bind('theme.logocolor');
}
</style>