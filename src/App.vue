<template>
  <div id="app" class="container">
    <h1>Find great books</h1>
    <LookupForm :onSubmit="onSubmit" />
    <hr v-if="goodreadsBooks.length" />
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
        <BookList :state="searchCatalogState" :books="biblioCommonsBooks" />
      </div>
    </div>
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
import { Book as BiblioCommonsBook } from "./types/bibliocommons";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

type Data = {
  readShelfState: QueryState;
  shelfIsCached: boolean;
  shelfCachedTimestamp: number | null;
  searchCatalogState: QueryState;
  goodreadsBooks: GoodreadsBook[];
  biblioCommonsBooks: BiblioCommonsBook[];
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
      goodreadsBooks: []
    };
  },
  methods: {
    async onSubmit(form: FormData) {
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

      this.searchCatalog(form.library.subdomain, form.branch, books);
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

<style scoped>
.container {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
</style>
