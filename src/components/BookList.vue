<template>
  <div v-if="state !== QueryState.NOT_STARTED">
    <h1 class="text-center">Available Titles</h1>
    <p class="lead" v-if="state === QueryState.IN_PROGRESS">
      <b-icon icon="arrow-clockwise" animation="spin"></b-icon>
      Searching the stacks...
    </p>
    <p class="text-center" v-if="howToCheckoutUrl && books.length">
      <a class="text-muted" :href="howToCheckoutUrl"
        >How to check out library items</a
      >
    </p>
    <ul class="list-unstyled">
      <li v-for="book in books" v-bind:key="book.call_number">
        <BookListItem :book="book" />
      </li>
    </ul>
    <div class="alert alert-warning" v-if="noResultsFound">
      Nothing found on the shelf!
    </div>
    <div class="alert alert-info" v-if="fewResultsFound">
      <strong>Expecting more matches?</strong>
      <p>
        The search algorithm currently searches for an <em>exact</em>
        match on the ISBNs from your Goodreads shelf. A better algorithm is in
        the works, where we favor exact ISBN matches but fall back to other
        versions.
      </p>
      <p>
        In the meantime, you might try swapping the ISBN "version" of any books
        on your list (e.g. from paperback to hardcover).
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { QueryState } from "../api";
import BookListItem from "./BookListItem.vue";
import { Book, Library } from "../types/bibliocommons";

export default Vue.extend({
  components: {
    BookListItem
  },
  props: {
    library: {
      type: Object as () => Library,
      required: false
    },
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
    howToCheckoutUrl: function(): string | null {
      if (!this.library) {
        return null;
      }
      const urlBySubdomain: Record<string, string> = {
        seattle:
          "https://www.spl.org/hours-and-locations/road-to-reopening/curbside-service",
        sfpl: "https://sfpl.org/sfpl-to-go",
        aclibrary: "https://guides.aclibrary.org/NoContactPickup"
      };
      return urlBySubdomain[this.library.subdomain] || null;
    },
    noResultsFound(): boolean {
      return this.state === QueryState.COMPLETED && !this.books.length;
    },
    fewResultsFound(): boolean {
      return this.state === QueryState.COMPLETED && this.books.length < 5;
    }
  },
  data() {
    return { QueryState };
  }
});
</script>
