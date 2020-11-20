<template>
  <div class="media my-4">
    <a :href="book.full_record_link">
      <img
        height="200"
        class="d-none d-md-block align-self-start mr-3"
        :src="book.cover_image"
      />
    </a>
    <div class="media-body">
      <h3 class="mt-0 mb-1">
        <span>{{ book.title }}</span>
        <a :href="book.full_record_link">
          <span class="badge badge-info float-right">{{
            book.call_number
          }}</span>
        </a>
      </h3>
      <h5 class="text-muted">{{ book.author }}</h5>
      <p>
        <a :href="book.full_record_link">
          <img
            height="200"
            class="d-block d-md-none float-left mb-3 mr-3"
            :src="book.cover_image"
          />
        </a>
        {{ book.description }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Book } from "../types/bibliocommons";

export default Vue.extend({
  props: {
    book: {
      type: Object as () => Book,
      required: true
    }
  }
});
</script>
