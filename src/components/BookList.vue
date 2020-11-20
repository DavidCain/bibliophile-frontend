<template>
  <div>
    <div>
      <h1 class="text-center">Available Titles</h1>
      <ul class="list-unstyled">
        <li v-for="book in books" v-bind:key="book.call_number">
          <BookListItem :book="book" />
        </li>
      </ul>
      <div class="alert alert-info" v-if="books.length === 0">
        Nothing found on the shelf.
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import BookListItem from "./BookListItem.vue";
import { Book } from "../types/bibliocommons";

export default Vue.extend({
  components: {
    BookListItem
  },
  props: {
    books: {
      type: Array as PropType<Array<Book>>,
      required: true
    }
  }
});
</script>
