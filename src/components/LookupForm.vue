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
              v-bind:value="branch"
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
import {
  Branch,
  Library,
  SFPL,
  SUPPORTED_LIBRARIES
} from "../types/bibliocommons";
import { FormData } from "../types/forms";
import {
  BButton,
  BForm,
  BFormRow,
  BFormSelect,
  BFormGroup,
  BFormInput
} from "bootstrap-vue";

const CACHED_FORM_DATA = "lastSubmittedFormData";

function populateForm(): FormData {
  const defaultForm: FormData = {
    userId: "41926065",
    shelf: "to-read",
    library: SFPL,
    branch:
      SFPL.branches.find(branch => branch.name === "*MAIN") ??
      SFPL.branches?.[0] ??
      null
  };

  const lastSubmittedItem: string | null = localStorage.getItem(
    CACHED_FORM_DATA
  );

  // If nothing was found in the cache, just use defaults
  if (!lastSubmittedItem) {
    return defaultForm;
  }

  let lastSubmitted: FormData;
  try {
    lastSubmitted = JSON.parse(lastSubmittedItem);
  } catch {
    localStorage.removeItem(CACHED_FORM_DATA);
    return defaultForm;
  }

  // We've found cached data!
  // Use as much of it as possible.
  const form: FormData = defaultForm;
  form.userId = lastSubmitted.userId || defaultForm.userId;
  form.shelf = lastSubmitted.shelf || defaultForm.shelf;

  // It's possible that the library has since changed its name/label
  // Subdomains should be constant, though.
  const library: Library | undefined = SUPPORTED_LIBRARIES.find(
    lib => lib.subdomain === lastSubmitted.library.subdomain
  );

  // If the cached library is no longer available, keep the Goodreads info
  // But decline to load the library or the branch.
  if (!library) {
    return form;
  }

  form.library = library;
  const lastBranch = lastSubmitted.branch;
  if (lastBranch) {
    // Handle the branch changing name/label, or being removed
    const lastUsedBranch: Branch | undefined = library.branches.find(
      libBranch =>
        // Branches can change either their label or their internal ID!
        // (For example, SF's Main Library changed from "MAIN" to "*MAIN"
        // Both should be unique, though, so match based on either
        libBranch.name === lastBranch.name ||
        libBranch.label === lastBranch.label
    );
    form.branch = lastUsedBranch || library.branches[0];
  } else {
    form.branch = null;
  }
  return form;
}

export default Vue.extend({
  components: { BButton, BForm, BFormSelect, BFormRow, BFormGroup, BFormInput },
  data() {
    return {
      form: populateForm(),
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
      this.form.branch = this.form.library.branches?.[0] ?? null;
    },
    async handleSubmit() {
      this.inProgress = true;
      // Save the form contents for use when the user returns to the site
      // (once they've changed their default user ID & library choices, keep that)
      localStorage.setItem(CACHED_FORM_DATA, JSON.stringify(this.form));

      try {
        await this.onSubmit(this.form);
      } finally {
        this.inProgress = false;
      }
    }
  }
});
</script>
