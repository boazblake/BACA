import { m } from "mithril"

const state = {
  images: [],
  showModal: Stream(false),
}

const BlogEditor = (mdl) => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "form",
        m("label", "Title", m("input")),
        m(
          "label",
          m(
            "a.secondary",
            {
              role: "button",
              onclick: () => state.showModal(!state.showModal()),
            },
            "Add An Image"
          )
        ),
        state.showModal() &&
          m(
            "section.modal-container",
            m(
              "article",
              m("input", { type: "file" }),
              m(
                "grid",
                m("a.m-r-16.contrast", { role: "button" }, "Cancel"),
                m("a", { role: "button" }, "Upload")
              )
            )
          ),
        m(
          "aside",
          state.images.map((src) => m("img", { src }))
        ),
        m("label", "Contents", m("textarea", { style: { height: "300px" } })),
        m("button", {}, "Submit")
      ),
  }
}

export default BlogEditor
