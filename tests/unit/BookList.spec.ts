/* eslint-disable @typescript-eslint/camelcase */
import { mount } from "@vue/test-utils";
import BookList from "@/components/BookList.vue";
import { Book, SFPL, SUPPORTED_LIBRARIES } from "@/types/bibliocommons";

import { QueryState } from "@/api";

const SAMPLE_BOOK: Book = {
  title: "The Hitchhiker's Guide to the Galaxy",
  author: "Adams, Douglas",
  description: "Don't forget your towel",
  call_number: "SF ADAMS DO",
  cover_image: null,
  full_record_link:
    "https://sfpl.bibliocommons.com/item/show/1016194093_the_hitchhikers_guide_to_the_galaxy"
};

describe("BookList.vue", () => {
  it("is blank in its inital starting state", () => {
    const wrapper = mount(BookList, {
      propsData: {
        library: null,
        state: QueryState.NOT_STARTED,
        books: []
      }
    });
    expect(wrapper.html()).toEqual("");
  });

  it("warns if no results were found", () => {
    const wrapper = mount(BookList, {
      propsData: {
        library: SFPL,
        state: QueryState.COMPLETED,
        books: []
      }
    });
    expect(wrapper.text()).toContain("Nothing found on the shelf!");
  });

  it("links to how COVID pickups work", () => {
    const propsData = {
      library: SUPPORTED_LIBRARIES.find(lib => lib.subdomain === "seattle"),
      state: QueryState.COMPLETED,
      books: [SAMPLE_BOOK]
    };
    const wrapper = mount(BookList, {
      propsData
    });
    expect(
      wrapper
        .find("p")
        .find("a")
        .attributes("href")
    ).toEqual(
      "https://www.spl.org/hours-and-locations/road-to-reopening/curbside-service"
    );
  });

  it("renders results even if library missing", () => {
    const propsData = {
      // Note that this should never really happen...
      // We only expect library to be null in the default starting state
      library: null,
      state: QueryState.COMPLETED,
      books: [SAMPLE_BOOK]
    };
    mount(BookList, {
      propsData
    });
  });
});
