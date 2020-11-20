<template>
  <div>
    <h1 class="text-center" v-if="books.length">Reading List</h1>
    <div v-for="book in books" v-bind:key="book.goodreads_id">
      <GoodreadsShelfItem :book="book" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Book } from "../types/goodreads";
import GoodreadsShelfItem from "./GoodreadsShelfItem.vue";

export default Vue.extend({
  components: {
    GoodreadsShelfItem
  },
  props: {
    books: {
      type: Array as PropType<Array<Book>>,
      required: true
    }
  }
});
</script>
