<template>
  <div id="app" class="container">
    <h1>Find great books</h1>
    <LookupForm :onSubmit="onSubmit" />
    <hr v-if="goodreadsBooks.length" />
    <div class="row">
      <div class="col-md-6">
        <GoodreadsShelf :books="goodreadsBooks" />
      </div>
      <div class="col-md-6">
        <BookList
          :books="biblioCommonsBooks"
          v-if="biblioCommonsBooks.length"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import BookList from "./components/BookList.vue";
import LookupForm from "./components/LookupForm.vue";
import GoodreadsShelf from "./components/GoodreadsShelf.vue";

import { readShelf, searchCatalog } from "./api";
import { FormData } from "./types/forms";
import { Book as GoodreadsBook } from "./types/goodreads";
import { Book as BiblioCommonsBook } from "./types/bibliocommons";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

type Data = {
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
      biblioCommonsBooks: [],
      goodreadsBooks: []
    };
  },
  methods: {
    async onSubmit(form: FormData) {
      const books: GoodreadsBook[] = await readShelf({
        userId: form.userId,
        shelf: form.shelf
      });
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

      const books: BiblioCommonsBook[] = await searchCatalog({
        // eslint-disable-next-line @typescript-eslint/camelcase
        biblio_subdomain: biblioSubdomain,
        books: bookDescriptions,
        branch
      });
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
