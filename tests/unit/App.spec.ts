import flushPromises from "flush-promises";
import { mount } from "@vue/test-utils";
import App from "@/App.vue";
import LookupForm from "@/components/LookupForm.vue";
import BookList from "@/components/BookList.vue";
import GoodreadsShelf from "@/components/GoodreadsShelf.vue";
import { SFPL } from "@/types/bibliocommons";
import { FormData } from "@/types/forms";

import { ReadShelfResponse, QueryState } from "@/api";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

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

  describe("API endpoint invocation", () => {
    it("Fetches books from Goodreads when clicking submit", async () => {
      const formData: FormData = {
        userId: "4444",
        shelf: "to-read",
        library: SFPL,
        branch: null
      };
      const response: ReadShelfResponse = {
        data: {
          isReadFromCache: false,
          cachedTimestamp: null,
          // We'll return no books, which is key later
          books: []
        }
      };
      mockedAxios.post.mockImplementationOnce(() => Promise.resolve(response));
      const wrapper = mount(App);

      // Initially, the book list has no info to work with
      expect(wrapper.findComponent(BookList).props()).toEqual({
        library: null,
        state: QueryState.NOT_STARTED,
        books: []
      });

      await wrapper.findComponent(LookupForm).props("onSubmit")(formData);
      flushPromises();

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://api.dcain.me/bibliophile/read_shelf",
        {
          userId: "4444",
          shelf: "to-read",
          skipCache: false
        }
      );

      // We never invoked `search_catalog` because there was nothing to search
      expect(wrapper.findComponent(BookList).props()).toEqual({
        library: SFPL,
        // There were no books to query, so we didn't start
        state: QueryState.NOT_STARTED,
        books: []
      });
    });

    it("Queries books on the shelf after getting Goodreads results", async () => {
      const formData: FormData = {
        userId: "4444",
        shelf: "to-read",
        library: SFPL,
        branch: null
      };
      const response: ReadShelfResponse = {
        data: {
          isReadFromCache: true,
          cachedTimestamp: 1606335704,
          // We'll return no books, which is key later
          books: [
            {
              // eslint-disable-next-line @typescript-eslint/camelcase
              goodreads_id: "135479",
              isbn: "0140285601",
              title: "Cat's Cradle",
              author: "Kurt Vonnegut Jr."
            }
          ]
        }
      };
      mockedAxios.post.mockImplementationOnce(() => Promise.resolve(response));

      // Second call is to search_catalog - we'll just have it return no books.
      mockedAxios.post.mockImplementationOnce(() =>
        Promise.resolve({ data: { books: [] } })
      );
      const wrapper = mount(App);

      // Initially, the book list has no info to work with
      expect(wrapper.findComponent(BookList).props()).toEqual({
        library: null,
        state: QueryState.NOT_STARTED,
        books: []
      });

      await wrapper.findComponent(LookupForm).props("onSubmit")(formData);
      flushPromises();

      // We query for books on the reader's Goodreads shelf
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://api.dcain.me/bibliophile/read_shelf",
        {
          userId: "4444",
          shelf: "to-read",
          skipCache: false
        }
      );

      // We pass the results to the GoodreadsShelf
      expect(wrapper.findComponent(GoodreadsShelf).props()).toEqual({
        state: QueryState.COMPLETED,
        isCached: true,
        cachedTimestamp: 1606335704,
        books: response.data.books
      });

      // With those results, we then query for books on the shelf
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://api.dcain.me/bibliophile/search_catalog",
        {
          // eslint-disable-next-line @typescript-eslint/camelcase
          biblio_subdomain: "sfpl",
          branch: null,
          books: [
            {
              isbn: "0140285601",
              title: "Cat's Cradle",
              author: "Kurt Vonnegut Jr."
            }
          ]
        }
      );

      expect(wrapper.findComponent(BookList).props()).toEqual({
        library: SFPL,
        state: QueryState.COMPLETED,
        books: []
      });
    });
  });
});
