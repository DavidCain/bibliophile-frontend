<template>
  <div id="app">
    <main role="main" class="container">
      <h1>Find great books</h1>
      <LookupForm :onSubmit="onSubmit" />
      <hr v-if="requestsStarted" />
      <div class="row">
        <div class="col-md-6">
          <GoodreadsShelf
            :state="readShelfState"
            :isCached="shelfIsCached"
            :cachedTimestamp="shelfCachedTimestamp"
            :books="goodreadsBooks"
          />
        </div>
        <div class="col-md-6">
          <BookList
            :library="searchedLibrary"
            :state="searchCatalogState"
            :books="biblioCommonsBooks"
          />
        </div>
      </div>
    </main>
    <footer class="footer">
      <div class="container text-center">
        <small class="text-muted">
          Open source
          <span v-if="gitCommitHash"
            >, running:
            <a :href="commitLink" class="text-monospace">{{
              shortGitCommitHash
            }}</a>
          </span>
        </small>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import BookList from "./components/BookList.vue";
import LookupForm from "./components/LookupForm.vue";
import GoodreadsShelf from "./components/GoodreadsShelf.vue";

import { QueryState, readShelf, searchCatalog } from "./api";
import { FormData } from "./types/forms";
import { Book as GoodreadsBook } from "./types/goodreads";
import { Library, Book as BiblioCommonsBook } from "./types/bibliocommons";

type Data = {
  readShelfState: QueryState;
  shelfIsCached: boolean;
  shelfCachedTimestamp: number | null;
  searchCatalogState: QueryState;
  goodreadsBooks: GoodreadsBook[];
  biblioCommonsBooks: BiblioCommonsBook[];
  searchedLibrary: Library | null;
};

export default Vue.extend({
  name: "App",
  components: {
    GoodreadsShelf,
    LookupForm,
    BookList
  },
  data(): Data {
    return {
      readShelfState: QueryState.NOT_STARTED,
      shelfIsCached: false,
      shelfCachedTimestamp: null,
      searchCatalogState: QueryState.NOT_STARTED,
      biblioCommonsBooks: [],
      goodreadsBooks: [],
      searchedLibrary: null
    };
  },
  computed: {
    requestsStarted(): boolean {
      return (
        this.readShelfState !== QueryState.NOT_STARTED ||
        this.searchCatalogState !== QueryState.NOT_STARTED
      );
    },
    commitLink(): string {
      return `https://github.com/DavidCain/bibliophile-frontend/commit/${this.gitCommitHash}`;
    },
    shortGitCommitHash(): string {
      return this.gitCommitHash.slice(0, 8);
    },
    gitCommitHash(): string {
      return process.env.GIT_COMMIT_HASH;
    }
  },
  methods: {
    async onSubmit(form: FormData) {
      this.searchedLibrary = form.library;

      this.readShelfState = QueryState.IN_PROGRESS;
      const { books, isReadFromCache, cachedTimestamp } = await readShelf({
        userId: form.userId,
        shelf: form.shelf,
        skipCache: false
      });
      this.shelfIsCached = isReadFromCache;
      this.shelfCachedTimestamp = cachedTimestamp;
      this.readShelfState = QueryState.COMPLETED;
      books.sort((a: GoodreadsBook, b: GoodreadsBook) =>
        a.title.localeCompare(b.title)
      );
      this.goodreadsBooks = books;

      this.searchCatalog(
        form.library.subdomain,
        form.branch?.name || null,
        books
      );
    },
    async searchCatalog(
      biblioSubdomain: string,
      branch: string | null,
      goodreadsBooks: GoodreadsBook[]
    ) {
      const bookDescriptions = goodreadsBooks.map(bk => ({
        isbn: bk.isbn,
        title: bk.title,
        author: bk.author
      }));

      // Clear out any books left from the last search
      this.biblioCommonsBooks = [];

      if (!bookDescriptions.length) {
        this.searchCatalogState = QueryState.NOT_STARTED;
        return;
      }

      this.searchCatalogState = QueryState.IN_PROGRESS;
      const books: BiblioCommonsBook[] = await searchCatalog({
        // eslint-disable-next-line @typescript-eslint/camelcase
        biblio_subdomain: biblioSubdomain,
        books: bookDescriptions,
        branch
      });
      this.searchCatalogState = QueryState.COMPLETED;
      books.sort((a: BiblioCommonsBook, b: BiblioCommonsBook) =>
        a.title.localeCompare(b.title)
      );
      this.biblioCommonsBooks = books;
    }
  }
});
</script>

<style>
/* NOTE! These styles are *not* scoped. We want html/body to apply globally. */
main {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

html {
  position: relative;
  min-height: 100%;
}

body {
  margin-bottom: 60px; /* Margin bottom by footer height */
}

.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px; /* Set the fixed height of the footer here */
  line-height: 60px; /* Vertically center the text there */
}
</style>
