import { handlers, exists, parseMarkdown } from "Utils"
import Task from "data.task"

const state = {
  editor: "",
  title: "",
  author: "",
  text: "",
  img: "",
  thumb: "",
  file: null,
  showModal: Stream(false),
  images: [],
  modalState: Stream("upload"),
  isEditing: Stream(true),
  showHelp: Stream(false),
  errors: {
    img: null,
  },
}

const resetModalState = (state) => {
  state.images = []
  state.modalState("upload")
}
const resetEditorState = (state) => {
  state.title = ""
  state.author = ""
  state.text = ""
  state.img = ""
  state.thumb = ""
  state.file = null
  state.isEditing(true)
  state.showModal(false)
  state.showHelp(false)
}

const fetchBlogImages = ({ attrs: { mdl, state } }) => {
  const onError = (e) => console.log(e)
  const onSuccess = ({ results }) => (state.images = results)
  mdl.http.back4App.getTask(mdl)("Classes/Gallery").fork(onError, onSuccess)
}

const setupEditor = ({ attrs: { mdl } }) => {
  const onError = (e) => console.log(e)
  const onSuccess = ({ title, text, img, thumb, objectId }) => {
    state.title = title
    state.text = text
    state.img = img
    state.thumb = thumb
    state.objectId = objectId
  }

  let id = m.route.get().split(":")[1]
  if (exists(id)) {
    mdl.http.back4App
      .getTask(mdl)(`Classes/Blogs/${id}`)
      .fork(onError, onSuccess)
  }
}

const isInvalid = () => !exists(state.title) || !exists(state.text)

const onSubmitError = (e) => (state.errors.img = e)
const onImgSuccess = ({ image, thumb }) => {
  state.img = image
  state.thumb = thumb
  state.showModal(false)
}

const saveImgToGalleryTask =
  (mdl) =>
  ({ data: { image, medium, thumb } }) =>
    mdl.http.back4App
      .postTask(mdl)("Classes/Gallery")({
        album: "blog",
        image: image.url,
        medium: medium.url,
        thumb: thumb.url,
      })
      .chain((_) =>
        Task.of({ image: image.url, medium: medium.url, thumb: thumb.url })
      )

const uploadImage = (mdl) => (file) => {
  const image = new FormData()
  image.append("image", file)
  mdl.http.imgBB
    .postTask(mdl)(image)
    .chain(saveImgToGalleryTask(mdl))
    .fork(onSubmitError, onImgSuccess)
}

const handleImage = (mdl) => (file) =>
  file ? uploadImage(mdl)(file) : state.showModal(false)

const toBlogs = () => m.route.set("/social/blog")

const onSubmitSuccess = () => toBlogs()

const submitBlog =
  (mdl) =>
  ({ title, img, text, thumb }) => {
    let dto = {
      title,
      img,
      text,
      author: mdl.user.name,
      thumb,
    }
    const updateOrSubmitBlog = state.objectId
      ? mdl.http.back4App.putTask(mdl)(`Classes/Blogs/${state.objectId}`)(dto)
      : mdl.http.back4App.postTask(mdl)("Classes/Blogs")(dto)

    updateOrSubmitBlog.fork(onSubmitError, onSubmitSuccess)
  }

const assignImg = (img, thumb) => {
  if (state.img == img) {
    state.img = ""
    state.thumb = ""
  } else {
    state.img = img
    state.thumb = thumb
  }
}

const deleteBlog = (mdl) =>
  mdl.http.back4App
    .deleteTask(mdl)(`Classes/Blogs/${state.objectId}`)
    .fork(toBlogs, toBlogs)

const Modal = () => {
  return {
    onremove: () => resetModalState(state),
    oninit: fetchBlogImages,
    view: ({ attrs: { mdl, state } }) =>
      m(
        "section.modal-container",
        m(
          "article.modal.card.grid",
          m(
            "header.modal-header",
            m(
              "nav",
              m(
                ".tabs",
                m(
                  `a.pointer.${state.modalState() == "upload" ? "active" : ""}`,
                  { onclick: (e) => state.modalState("upload") },
                  "Upload New Image"
                ),
                m(
                  `a.pointer.${state.modalState() == "select" ? "active" : ""}`,
                  { onclick: (e) => state.modalState("select") },
                  "Select From Database"
                )
              )
            )
          ),
          m(
            "section.modal-content",
            m(
              "form",
              state.modalState() == "upload"
                ? m("input", { type: "file", id: "file" })
                : state.images.map(({ image, thumb }) =>
                    m(
                      `figure.button.${
                        thumb == state.thumb ? "primary" : "outline"
                      }`,
                      {
                        onclick: (e) => assignImg(image, thumb),
                      },
                      m("img", { src: thumb })
                    )
                  )
            )
          ),
          m(
            "section.modal-footer",
            m(
              ".tabs grouped",
              m("button", { onclick: () => state.showModal(false) }, "Cancel"),
              m(
                "button",
                {
                  onclick: (e) => handleImage(mdl)(state.file),
                  role: "button",
                  type: "submit",
                  disabled: !state.file && !exists(state.img),
                },
                state.modalState() == "select" ? "Use" : "Upload"
              )
            )
          )
        )
      ),
  }
}

const BlogEditor = () => {
  const onInput = handlers(["oninput"], (e) => {
    if (e.target.id == "file") {
      state[e.target.id] = e.target.files[0]
    } else {
      state[e.target.id] = e.target.value
    }
  })

  return {
    onremove: () => resetEditorState(state),
    oninit: setupEditor,
    view: ({ attrs: { mdl } }) => {
      // console.log(JSON.stringify(state))
      return m(
        ".grid",
        m(
          "form",
          { ...onInput },
          m(
            "",
            m("label", "Title"),
            m("input", { id: "title", value: state.title })
          ),

          state.thumb && m("aside", m("img", { src: state.thumb })),
          m(
            "button.secondary",
            {
              onclick: (e) => {
                e.preventDefault()
                state.showModal(!state.showModal())
              },
            },
            state.thumb ? "Update Image" : "Add An Image"
          ),
          state.showModal() && m(Modal, { state, mdl }),
          m(
            "",
            m("label", "Contents"),
            m(
              "button",
              {
                onclick: (e) => {
                  e.preventDefault()
                  state.isEditing(!state.isEditing())
                },
              },
              state.isEditing() ? "Preview" : "Edit"
            ),
            m(
              "button",
              {
                onclick: (e) => {
                  e.preventDefault()
                  state.showHelp(true)
                },
              },
              "How To Use"
            ),
            state.showHelp() &&
              m(
                "section.modal-container",
                {
                  onclick: (e) => {
                    state.showHelp(false)
                  },
                },
                m(
                  ".modal.card",
                  m("h3", "Headings"),
                  m("h4", "use #"),
                  m("h3", "Italics & Bold"),
                  m("h4", "use *"),
                  m("h3", "Lists"),
                  m("h4", "use + or -"),
                  m("h3", "Links"),
                  m("h4", "use []()")
                )
              ),

            state.isEditing()
              ? m("textarea", {
                  value: state.text,
                  id: "text",
                  style: { height: "300px" },
                })
              : m(
                  "hgroup",
                  m(
                    "h4",
                    m.trust(
                      HtmlSanitizer.SanitizeHtml(parseMarkdown(state.text))
                    )
                  )
                )
          ),

          m(
            "nav.grid",
            m(
              m.route.Link,
              {
                selector: "button",
                href: "/social/blog",
              },
              "Cancel"
            ),
            m(
              "button",
              {
                disabled: isInvalid(),
                onclick: (e) => {
                  e.preventDefault()
                  submitBlog(mdl)(state)
                },
              },
              state.objectId ? "Update" : "Submit"
            ),
            m("button", { onclick: (e) => deleteBlog(mdl) }, "Delete")
          )
        )
      )
    },
  }
}

export default BlogEditor
