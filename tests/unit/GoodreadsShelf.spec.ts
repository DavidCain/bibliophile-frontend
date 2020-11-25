/* eslint-disable @typescript-eslint/camelcase */
import { mount } from "@vue/test-utils";
import GoodreadsShelf from "@/components/GoodreadsShelf.vue";

import { QueryState } from "@/api";
import { BIcon } from "bootstrap-vue";

describe("GoodreadsShelf.vue", () => {
  it("is blank in its inital starting state", () => {
    const wrapper = mount(GoodreadsShelf, {
      propsData: {
        state: QueryState.NOT_STARTED,
        isCached: false,
        cachedTimestamp: null,
        books: []
      }
    });
    expect(wrapper.html()).toEqual("");
  });

  it("gives a progress indicator if in progress", () => {
    const wrapper = mount(GoodreadsShelf, {
      propsData: {
        state: QueryState.IN_PROGRESS,
        isCached: false,
        cachedTimestamp: null,
        books: []
      }
    });
    const text = wrapper.text();
    expect(text).toContain("Reading List");
    expect(text).toContain("Fetching books on your Goodreads shelf...");
    expect(wrapper.findComponent(BIcon).exists()).toBe(true);
  });

  it("warns if no results were found", () => {
    const wrapper = mount(GoodreadsShelf, {
      propsData: {
        state: QueryState.COMPLETED,
        isCached: false,
        cachedTimestamp: null,
        books: []
      }
    });
    expect(wrapper.text()).toContain("No books found on your shelf!");
    expect(wrapper.text()).toContain("Check your ID & shelf name");
  });

  describe("caching", () => {
    it("explains if results were cached", () => {
      const wrapper = mount(GoodreadsShelf, {
        propsData: {
          state: QueryState.COMPLETED,
          isCached: true,
          cachedTimestamp: 1606286340, // 2020-11-24 22:39:00 PST
          books: []
        }
      });
      expect(wrapper.text()).toContain("Using cached results");
      // We should also check that it uses the correct datetime.
      // If the viewer was in PST, for example, it would say:
      // "Using cached results from 11/24/2020, 10:39:00 PM."
      // However, testing locales is tricky!
    });

    it("handles if the backend reports cached, but without a timestamp", () => {
      const wrapper = mount(GoodreadsShelf, {
        propsData: {
          state: QueryState.COMPLETED,
          isCached: true,
          cachedTimestamp: null,
          books: []
        }
      });
      expect(wrapper.text()).toContain("Using cached results");
      expect(wrapper.text()).not.toContain("2020");
    });

    it("ignores caching information in any state but completed", () => {
      const wrapper = mount(GoodreadsShelf, {
        propsData: {
          state: QueryState.IN_PROGRESS,
          // These should have been reset, but we ignore them anyway
          isCached: true,
          cachedTimestamp: 1606286340, // 2020-11-24 22:39:00 PST
          books: []
        }
      });
      expect(wrapper.text()).not.toContain("Using cached results");
      expect(wrapper.text()).not.toContain("2020");
    });
  });
});
