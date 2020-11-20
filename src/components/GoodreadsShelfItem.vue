<template>
  <div class="container">
    <div class="row">
      <div class="col-10">
        <div class="text-truncate">
          <a :href="bookLink">
            {{ book.title }}
          </a>
        </div>
      </div>
      <div class="col-2 text-right">
        <small class="text-muted" v-if="book.isbn">{{ book.isbn }}</small>
        <span class="badge badge-warning" v-if="!book.isbn">No ISBN</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Book } from "../types/goodreads";

export default Vue.extend({
  props: {
    book: {
      type: Object as () => Book,
      required: true
    }
  },
  computed: {
    bookLink(): string {
      return `https://www.goodreads.com/book/show/${this.book.goodreads_id}`;
    }
  }
});
</script>
