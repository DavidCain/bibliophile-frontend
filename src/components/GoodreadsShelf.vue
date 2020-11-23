<template>
  <div v-if="state !== QueryState.NOT_STARTED">
    <h1 class="text-center">Reading List</h1>
    <p class="lead" v-if="state === QueryState.IN_PROGRESS">
      <b-icon icon="arrow-clockwise" animation="spin"></b-icon>
      Fetching books on your Goodreads shelf...
    </p>
    <div v-for="book in books" v-bind:key="book.goodreads_id">
      <GoodreadsShelfItem :book="book" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { QueryState } from "../api";
import { Book } from "../types/goodreads";
import GoodreadsShelfItem from "./GoodreadsShelfItem.vue";

export default Vue.extend({
  components: {
    GoodreadsShelfItem
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
  data() {
    return { QueryState };
  }
});
</script>
