<template>
  <div v-if="state !== QueryState.NOT_STARTED">
    <h1 class="text-center">Reading List</h1>
    <p class="lead" v-if="state === QueryState.IN_PROGRESS">
      <b-icon icon="arrow-clockwise" animation="spin"></b-icon>
      Fetching books on your Goodreads shelf...
    </p>
    <p class="text-muted text-center" v-if="showResultsCached">
      Using cached results
      <span v-if="cachedDatestring">from {{ cachedDatestring }}</span
      >.
    </p>
    <div v-if="noResultsFound">
      <div class="alert alert-warning">
        <strong>No books found on your shelf!</strong> Check your ID & shelf
        name.
      </div>
    </div>
    <div v-for="book in books" v-bind:key="book.goodreads_id">
      <GoodreadsShelfItem :book="book" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { BIcon, BIconArrowClockwise } from "bootstrap-vue";

import { QueryState } from "../api";
import { Book } from "../types/goodreads";
import GoodreadsShelfItem from "./GoodreadsShelfItem.vue";

export default Vue.extend({
  components: {
    BIcon,
    // eslint-disable-next-line vue/no-unused-components
    BIconArrowClockwise,
    GoodreadsShelfItem
  },
  props: {
    state: {
      type: Number as () => QueryState,
      required: true
    },
    isCached: {
      type: Boolean,
      required: true
    },
    cachedTimestamp: {
      type: Number,
      required: false
    },
    books: {
      type: Array as PropType<Array<Book>>,
      required: true
    }
  },
  data() {
    return { QueryState };
  },
  computed: {
    cachedDatestring(): string | null {
      if (!this.cachedTimestamp) {
        return null;
      }
      const dateObject = new Date(this.cachedTimestamp * 1000);
      return dateObject.toLocaleString();
    },
    noResultsFound(): boolean {
      return this.state === QueryState.COMPLETED && !this.books.length;
    },
    showResultsCached(): boolean {
      // Results aren't cached, exit early
      if (!this.isCached) {
        return false;
      }
      // We're not showing completed results
      if (this.state !== QueryState.COMPLETED) {
        return false;
      }
      // The backend should *always* give a timestamp with "is cached"
      // Just in case, though, we can handle no value
      if (!this.cachedTimestamp) {
        return true;
      }
      const currentTime = Math.floor(Date.now() / 1000);
      // If the cache comes from the last minute, don't bother showing anything.
      return currentTime > this.cachedTimestamp + 60;
    }
  }
});
</script>
