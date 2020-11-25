import { mount } from "@vue/test-utils";
import App from "@/App.vue";
import LookupForm from "@/components/LookupForm.vue";
import BookList from "@/components/BookList.vue";
import GoodreadsShelf from "@/components/GoodreadsShelf.vue";

import { QueryState } from "@/api";

describe("App.vue", () => {
  it("displays a starting state", () => {
    const wrapper = mount(App);

    expect(wrapper.text()).toContain("Find great books");
    expect(wrapper.findComponent(LookupForm).exists()).toBe(true);
    expect(wrapper.findComponent(GoodreadsShelf).props()).toEqual({
      state: QueryState.NOT_STARTED,
      isCached: false,
      cachedTimestamp: null,
      books: []
    });
    expect(wrapper.findComponent(BookList).props()).toEqual({
      library: null,
      state: QueryState.NOT_STARTED,
      books: []
    });
  });

  describe("Git commit hash", () => {
    const ORIG_ENV = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...ORIG_ENV };
    });

    afterAll(() => {
      process.env = ORIG_ENV;
    });

    it("displays the hash in the footer", () => {
      process.env.GIT_COMMIT_HASH = "a934689e29bf05fed98c910c1d242580b69091a9";
      const wrapper = mount(App);

      const footer = wrapper.find("footer");
      expect(footer.text()).toContain("Open source");
      expect(footer.find("a").attributes("href")).toEqual(
        "https://github.com/DavidCain/bibliophile-frontend/commit/a934689e29bf05fed98c910c1d242580b69091a9"
      );
    });
  });
});
