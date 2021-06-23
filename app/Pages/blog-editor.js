import { handlers } from "Utils"

const state = {
  title: "",
  author: "",
  text: "",
  img: "",
  file: null,
  showModal: Stream(false),
  errors: {
    img: null,
  },
}

const onSubmitError = (e) => (state.errors.img = e)
const onImgSuccess = ({
  data: {
    image: { url },
  },
}) => {
  state.img = url
  state.showModal(false)
}

const uploadImage = (mdl) => (file) => {
  const image = new FormData()
  image.append("image", file)
  mdl.http.imgBB.postTask(mdl)(image).fork(onSubmitError, onImgSuccess)
}

const onSubmitSuccess = (d) => console.log(d)

const submitBlog =
  (mdl) =>
  ({ title, img, text, date, author }) => {
    let dto = {
      title,
      img,
      text,
      author: mdl.user.name,
    }
    mdl.http.back4App
      .postTask(mdl)("Classes/Blogs")(dto)
      .fork(onSubmitError, onSubmitSuccess)
  }

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
        ".grid",
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
                      disabled: !state.file,
                    },
                    "Upload"
                  )
                )
              )
            ),
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
                submitBlog(mdl)(state)
              },
            },
            "Submit"
          )
        ),
        state.img && m("aside", m("img", { src: state.img }))
      ),
  }
}

export default BlogEditor
