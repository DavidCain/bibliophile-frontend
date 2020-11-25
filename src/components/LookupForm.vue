<template>
  <div>
    <b-form @submit.prevent="handleSubmit">
      <b-form-row>
        <b-form-group
          id="user-id"
          class="col-md-6"
          label="Goodreads user ID"
          label-for="goodreads-user-id"
        >
          <b-form-input
            id="goodreads-user-id"
            aria-describedby="id-help"
            v-model="form.userId"
            type="text"
            required
            placeholder="Goodreads numeric user ID"
          ></b-form-input>
          <small id="id-help" class="form-text text-muted">
            (From the URL on your profile page, e.g.
            goodreads.com/user/show/<strong>41926065</strong>-username)
          </small>
        </b-form-group>
        <b-form-group
          id="shelf"
          class="col-md-6"
          label="Goodreads shelf"
          label-for="goodreads-shelf"
        >
          <b-form-input
            id="goodreads-shelf"
            aria-describedby="shelf-help"
            v-model="form.shelf"
            type="text"
            required
          ></b-form-input>
          <small id="shelf-help" class="form-text text-muted">
            Your wanted books.
            <span v-if="form.userId && form.shelf">
              Link should work:
              <a :href="shelfLink">{{ form.shelf }} shelf</a>
            </span>
          </small>
        </b-form-group>
      </b-form-row>

      <b-form-row>
        <b-form-group
          id="library-system"
          class="col-md-6"
          label="Library system"
          label-for="library"
        >
          <b-form-select
            id="library"
            v-model="form.library"
            v-on:change="selectFirstBranch"
            :options="libraryOptions"
            required
          ></b-form-select>
        </b-form-group>

        <b-form-group
          id="branch"
          class="col-md-6"
          label="Library branch"
          label-for="library-branch"
        >
          <b-form-select id="library-branch" v-model="form.branch" required>
            <option
              v-for="branch in form.library.branches"
              v-bind:key="branch.name"
              v-bind:value="branch.name"
            >
              {{ branch.label }}
            </option>
          </b-form-select>
        </b-form-group>
      </b-form-row>

      <b-button type="submit" variant="primary" :disabled="inProgress">
        Find books on the shelf
      </b-button>
    </b-form>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Branch, SFPL, SUPPORTED_LIBRARIES } from "../types/bibliocommons";
import { FormData } from "../types/forms";
import {
  BButton,
  BForm,
  BFormRow,
  BFormSelect,
  BFormGroup,
  BFormInput
} from "bootstrap-vue";

export default Vue.extend({
  components: { BButton, BForm, BFormSelect, BFormRow, BFormGroup, BFormInput },
  data() {
    const mainBranch: Branch | null =
      SFPL.branches.find(branch => branch.name === "*MAIN") ??
      SFPL.branches?.[0] ??
      null;

    const form: FormData = {
      userId: "41926065",
      shelf: "to-read",
      library: SFPL,
      branch: mainBranch.name
    };

    return {
      form,
      libraryOptions: SUPPORTED_LIBRARIES.map(lib => ({
        value: lib,
        text: lib.name
      })),
      inProgress: false
    };
  },
  props: {
    onSubmit: {
      type: Function as PropType<(form: FormData) => void>,
      required: true
    }
  },
  computed: {
    shelfLink: function(): string {
      return `https://www.goodreads.com/review/list/${this.form.userId}?shelf=${this.form.shelf}`;
    }
  },
  methods: {
    selectFirstBranch() {
      const branch = this.form.library.branches?.[0];
      this.form.branch = branch?.name ?? null;
    },
    async handleSubmit() {
      this.inProgress = true;
      try {
        await this.onSubmit(this.form);
      } finally {
        this.inProgress = false;
      }
    }
  }
});
</script>
