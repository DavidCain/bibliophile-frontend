<template>
  <div v-if="state !== QueryState.NOT_STARTED">
    <h1 class="text-center">Available Titles</h1>
    <p class="lead" v-if="state === QueryState.IN_PROGRESS">
      <b-icon icon="arrow-clockwise" animation="spin"></b-icon>
      Searching the stacks...
    </p>
    <ul class="list-unstyled">
      <li v-for="book in books" v-bind:key="book.call_number">
        <BookListItem :book="book" />
      </li>
    </ul>
    <div class="alert alert-warning" v-if="noResultsFound">
      Nothing found on the shelf!
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { QueryState } from "../api";
import BookListItem from "./BookListItem.vue";
import { Book } from "../types/bibliocommons";

export default Vue.extend({
  components: {
    BookListItem
  },
  props: {
    state: {
      type: Number as () => QueryState,
      required: true
    },
    books: {
      type: Array as PropType<Array<Book>>,
      required: true
    }
  },
  computed: {
    noResultsFound(): boolean {
      return this.state === QueryState.COMPLETED && !this.books.length;
    }
  },
  data() {
    return { QueryState };
  }
});
</script>
