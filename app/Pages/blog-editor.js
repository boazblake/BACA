import { handlers } from "Utils"

const state = {
  title: "",
  author: "",
  date: "",
  text: "",
  img: "",
  file: null,
  showModal: Stream(false),
}

const uploadImage = (mdl) => (file) =>
  mdl.http.imgBB.postTask(mdl)(file).fork(onSuccess, onError)

const BlogEditor = (mdl) => {
  const onInput = handlers(["oninput"], (e) => {
    if (e.target.id == "file") {
      state[e.target.id] = e.target.files[0]
    } else {
      state[e.target.id] = e.target.value
    }
  })

  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "form",
        { ...onInput },
        m("label", "Title", m("input", { id: "title", value: state.title })),
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
            "article.modal-container",
            m(
              "form",
              m("input", { type: "file", id: "file" }),
              m(
                "grid",
                m(
                  "a.m-r-16.contrast",
                  { onclick: () => state.showModal(false), role: "button" },
                  "Cancel"
                ),
                m(
                  "a",
                  {
                    onclick: (e) => uploadImage(mdl)(state.file),
                    role: "button",
                    type: "submit",
                  },
                  "Upload"
                )
              )
            )
          ),
        m("aside", m("img", { src: state.img })),
        m(
          "label",
          "Contents",
          m("textarea", { id: "text", style: { height: "300px" } })
        ),
        m(
          "button",
          {
            onclick: (e) => {
              e.preventDefault()
              console.log(state)
            },
          },
          "Submit"
        )
      ),
  }
}

export default BlogEditor
