<template>
  <div>
    <div class="faq-view">
      <div class="question">
        <div class="question-verbiage">What is RSS/ATOM?</div>
        <div class="answer">
          <p>RSS (Really Simple Syndication) is a web feed format used for publishing frequently updated content such as blog entries, news headlines, audio, and video. It was first introduced by Netscape in 1999 as an XML-based format for syndicating content from news sites and blogs.</p>
          <p>Over the years, RSS has evolved and several versions of the protocol have been released, including RSS 0.91, RSS 1.0, RSS 2.0, and RSS 2.0.1. Each version added new features and functionality, such as support for multimedia content and enclosures.</p>
          <p>Atom, on the other hand, is a similar web feed format that was introduced in 2003 as an alternative to RSS. Like RSS, Atom is an XML-based format that allows publishers to syndicate content such as blog posts, news articles, and podcasts.</p>
          <p>One of the key differences between RSS and Atom is that Atom is a standardized format, while RSS has multiple versions and variations. Additionally, Atom is designed to be more extensible and flexible than RSS, allowing for easier customization and support for additional metadata.</p>
          <p>Both RSS and Atom allow users to subscribe to content feeds using a web feed reader or aggregator, which can automatically retrieve and display new content from multiple sources in a single location. This makes it easier for users to stay up-to-date on their favorite websites and content creators without having to manually check each site for updates.</p>
          <p>Overall, RSS and Atom have played an important role in the evolution of web content syndication and have helped to make it easier for users to access and consume the content they care about.</p>
        </div>
      </div>

      <div class="question">
        <div class="question-verbiage">What are some applications of RSS/ATOM?</div>
        <div class="answer">
          <p>The main applications of RSS and Atom are to facilitate the distribution and aggregation of web content, such as blog posts, news articles, podcasts, and video content. These protocols provide a standardized way for content producers to syndicate their content to interested readers, and for readers to easily access and consume that content.</p>
        </div>
      </div>

      <!-- <div class="question">
        <div class="question-verbiage">How can I discover new and interesting RSS feeds?</div>
        <div class="answer">
          FEEDGEARS GPT-BASED RECOMMENDATION ENGINE 

          RSS SEARCH ENGINES 

          CURATED LISTS 
        </div>
      </div> -->

      <div class="question">
        <div class="question-verbiage">What is OPML and how does it relate to RSS/ATOM?</div>
        <div class="answer">
          <p>OPML (Outline Processor Markup Language) is a file format used to exchange outlines between applications, and it is closely related to RSS and Atom. In fact, OPML is often used as a way to export and import RSS/Atom feed lists between different RSS/Atom readers.</p>
          <p>OPML is a simple XML-based format that allows you to create a hierarchy of outlines, with each outline containing a title and a URL. In the context of RSS/Atom, an OPML file can be used to store a list of RSS/Atom feed URLs, along with any associated metadata, such as categories or tags.</p>
          <p>Many RSS/Atom readers allow you to import and export OPML files, which makes it easy to move your feed list between different applications. For example, if you switch from one RSS reader to another, you can export your feed list as an OPML file from the old reader and then import it into the new one.</p>
          <p>In addition to being used for RSS/Atom feed lists, OPML can also be used to organize other types of content, such as podcast subscriptions, bookmarks, or notes. Overall, OPML is a flexible and useful format for exchanging hierarchical lists of data between different applications and services.</p>
        </div>
      </div>

      <!-- <div class="question">
        <div class="question-verbiage">Where can I learn more?</div>
        <div class="answer">
          OFFICIAL SPECIFICATIONS 

          TUTORIALS 

          DEVELOPER COMMUNITIES 

          OTHER RSS READERS 

          BOOKS 
        </div>
      </div> -->
    </div>
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
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-left: 4%;
  margin-right: 4%;
  padding-top: 2%;
  padding-bottom: 2%;
}

@media (max-width: 640px) {
  .faq-view {
    margin-left: 2%;
    margin-right: 2%;
  }
}

@media (max-width: 320px) {
  .faq-view {
    margin-left: 0;
    margin-right: 0;
  }
}

.question {
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: v-bind('theme.appbg');
  padding: .75rem;
  box-shadow: 3px 3px 3px v-bind('theme.darkshadow');
}

.question-verbiage {
  font-family: "Russo One", system-ui, sans-serif;
  font-weight: bold;
  font-size: larger;
  color: v-bind('theme.logocolor');
  text-shadow: 1px 1px 1px v-bind('theme.accentshadow');
  margin: 0rem;
  padding-bottom: .75rem;
  text-align: left;
}

.answer {
  text-align: left;
}
</style>