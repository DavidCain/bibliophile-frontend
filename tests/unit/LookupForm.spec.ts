import { mount } from "@vue/test-utils";
import LookupForm from "@/components/LookupForm.vue";
import { FormData } from "@/types/forms";
import { SFPL, Library } from "@/types/bibliocommons";

describe("GoodreadsShelfItem.vue", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const defaultForm: FormData = {
    userId: "41926065",
    shelf: "to-read",
    library: SFPL,
    branch: { name: "*MAIN", label: "Main Library" }
  };

  describe("localStorage caching", () => {
    it("uses defaults when localStorage is empty", () => {
      const onSubmit = jest.fn() as (form: FormData) => void;
      const wrapper = mount(LookupForm, {
        propsData: { onSubmit }
      });
      wrapper.find("form").trigger("submit");
      expect(onSubmit).toBeCalledWith(defaultForm);
    });

    it("saves the form data on submission", async () => {
      const onSubmit = jest.fn() as (form: FormData) => void;
      const wrapper = mount(LookupForm, {
        propsData: { onSubmit }
      });

      expect(localStorage.getItem("lastSubmittedFormData")).toBeNull();

      await wrapper.find("input[id=goodreads-user-id]").setValue("8005882300");
      wrapper.find("form").trigger("submit");

      const formData = {
        userId: "8005882300",
        shelf: "to-read",
        library: SFPL,
        branch: { name: "*MAIN", label: "Main Library" }
      };
      expect(onSubmit).toBeCalledWith(formData);
      const cachedData = localStorage.getItem("lastSubmittedFormData");
      expect(cachedData).not.toBeNull();
      expect(JSON.parse(cachedData || "{}")).toStrictEqual(formData);
    });

    it("defaults to the last-used configuration if found", () => {
      const lastUsed = {
        userId: "12345678",
        shelf: "to-read",
        library: SFPL,
        branch: { name: "*MAIN", label: "Main Library" }
      };
      localStorage.setItem("lastSubmittedFormData", JSON.stringify(lastUsed));

      const onSubmit = jest.fn() as (form: FormData) => void;
      const wrapper = mount(LookupForm, {
        propsData: { onSubmit }
      });
      wrapper.find("form").trigger("submit");
      expect(onSubmit).toBeCalledWith(lastUsed);
    });

    it("uses the default configuration if saved value is not valid JSON", () => {
      localStorage.setItem("lastSubmittedFormData", "Not valid JSON: [");
      const onSubmit = jest.fn() as (form: FormData) => void;
      const wrapper = mount(LookupForm, {
        propsData: { onSubmit }
      });
      wrapper.find("form").trigger("submit");
      expect(onSubmit).toBeCalledWith(defaultForm);
    });

    it("handles libraries that aren't found in the supported list", () => {
      const atlantis: Library = {
        subdomain: "atlantis",
        name: "Atlantis Eternal Library",
        branches: [
          { name: "Central", label: "Central Branch" },
          { name: "Downtown", label: "Downtown Branch" }
        ]
      };
      localStorage.setItem(
        "lastSubmittedFormData",
        JSON.stringify({
          userId: "012345689",
          shelf: "read-before-i-die",
          library: atlantis,
          branch: { name: "Downtown", label: "Downtown Library" }
        })
      );
      const onSubmit = jest.fn() as (form: FormData) => void;
      const wrapper = mount(LookupForm, {
        propsData: { onSubmit }
      });
      wrapper.find("form").trigger("submit");
      expect(onSubmit).toBeCalledWith({
        // We kept the userId & shelf
        userId: "012345689",
        shelf: "read-before-i-die",
        // However, the library & branch use defaults
        library: defaultForm.library,
        branch: defaultForm.branch
      });
    });

    it("handles libraries changing name", () => {
      const oldNameSfpl: Library = {
        subdomain: "sfpl",
        name: "San Franciiiiiiiisco Library",
        branches: SFPL.branches
      };
      localStorage.setItem(
        "lastSubmittedFormData",
        JSON.stringify({
          userId: "012345689",
          shelf: "read-before-i-die",
          library: oldNameSfpl,
          branch: null
        })
      );
      const onSubmit = jest.fn() as (form: FormData) => void;
      const wrapper = mount(LookupForm, {
        propsData: { onSubmit }
      });
      wrapper.find("form").trigger("submit");
      expect(onSubmit).toBeCalledWith({
        userId: "012345689",
        shelf: "read-before-i-die",
        // The library uses the subdomain to see it's the same entry
        library: SFPL,
        branch: null
      });
    });

    it("handles branch being removed from options", () => {
      localStorage.setItem(
        "lastSubmittedFormData",
        JSON.stringify({
          userId: "012345689",
          shelf: "read-before-i-die",
          library: SFPL,
          // This is a real branch, since closed.
          branch: { name: "RICHMOND BRANCH", label: "Richmond" }
        })
      );
      const onSubmit = jest.fn() as (form: FormData) => void;
      const wrapper = mount(LookupForm, {
        propsData: { onSubmit }
      });
      wrapper.find("form").trigger("submit");
      expect(onSubmit).toBeCalledWith({
        userId: "012345689",
        shelf: "read-before-i-die",
        library: SFPL,
        // We just default to the first option
        branch: { name: "*MAIN", label: "Main Library" }
      });
    });
  });
});
