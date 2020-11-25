import { mount } from "@vue/test-utils";
import GoodreadsShelfItem from "@/components/GoodreadsShelfItem.vue";
import { Book } from "@/types/goodreads";

describe("GoodreadsShelfItem.vue", () => {
  it("renders", () => {
    const book: Book = {
      // eslint-disable-next-line @typescript-eslint/camelcase
      goodreads_id: "135479",
      isbn: "0140285601",
      title: "Cat's Cradle",
      author: "Kurt Vonnegut Jr."
    };
    const wrapper = mount(GoodreadsShelfItem, {
      propsData: { book }
    });

    const bookLink = wrapper.find("a").attributes("href");
    expect(bookLink).toBe("https://www.goodreads.com/book/show/135479");
  });
});
