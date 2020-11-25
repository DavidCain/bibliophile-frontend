/* eslint-disable @typescript-eslint/camelcase */
import { mount } from "@vue/test-utils";
import BookListItem from "@/components/BookListItem.vue";

describe("BookListItem.vue", () => {
  it("describes a single book", () => {
    const wrapper = mount(BookListItem, {
      propsData: {
        book: {
          title: "The Hitchhiker's Guide to the Galaxy",
          author: "Adams, Douglas",
          description: "Don't forget your towel",
          call_number: "SF ADAMS DO",
          cover_image: null,
          full_record_link:
            "https://sfpl.bibliocommons.com/item/show/1016194093_the_hitchhikers_guide_to_the_galaxy"
        }
      }
    });

    expect(wrapper.text()).toContain("Don't forget your towel");
    expect(wrapper.find("h3").text()).toEqual(
      "The Hitchhiker's Guide to the Galaxy SF ADAMS DO"
    );
  });
});
