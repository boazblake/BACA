import { handlers, exists } from "Utils"
import Task from "data.task"
import { Jodit } from "jodit"

const state = {
  jodit: null,
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
  showPreview: Stream(false),
  isEditing: Stream(false),
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
  state.jodit.value = null
  state.showPreview(false)
  state.isEditing(false)
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
    state.jodit.value = state.text
  }

  let id = m.route.get().split(":")[1]
  if (exists(id)) {
    state.isEditing(true)
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
  ({ data: { image, thumb } }) =>
    mdl.http.back4App
      .postTask(mdl)("Classes/Gallery")({
        album: "blog",
        image: image.url,
        thumb: thumb.url,
      })
      .chain((_) => Task.of({ image: image.url, thumb: thumb.url }))

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
                  {
                    onclick: (e) => {
                      e.stopPropagation()
                      state.modalState("upload")
                    },
                  },
                  "Upload New Image"
                ),
                m(
                  `a.pointer.${state.modalState() == "select" ? "active" : ""}`,
                  {
                    onclick: (e) => {
                      e.stopPropagation()
                      state.modalState("select")
                    },
                  },
                  "Select From Database"
                )
              )
            )
          ),
          m(
            "section.modal-content",
            m(
              "form.grid",
              state.modalState() == "upload"
                ? m("input", { type: "file", id: "file" })
                : state.images.map(({ image, thumb }) =>
                    m(
                      `figure.col-6.button.${
                        thumb == state.thumb ? "primary" : "outline"
                      }`,
                      {
                        onclick: (e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          assignImg(image, thumb)
                        },
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
              m(
                "button.button",
                { onclick: () => state.showModal(false) },
                "Cancel"
              ),
              m(
                "button.button.primary",
                {
                  onclick: (e) => {
                    e.preventDefault()
                    handleImage(mdl)(state.file)
                  },
                  role: "button",
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
          "form.container",
          { ...onInput },
          m(
            "section",
            m("label", "Title", m("input", { id: "title", value: state.title }))
          ),

          m(
            "section",
            state.thumb &&
              m(
                "aside.col-6",
                m("img.col-12", { src: state.thumb }),
                m(
                  "button.primary.col-12",
                  {
                    onclick: (e) => {
                      e.preventDefault()
                      state.thumb = ""
                      state.img = ""
                    },
                  },
                  "Remove image"
                )
              ),
            m(
              ".col-12",
              m(
                "button.primary.col-6",
                {
                  onclick: (e) => {
                    e.preventDefault()
                    state.showModal(!state.showModal())
                  },
                },
                state.thumb ? "Update Image" : "Add An Image"
              )
            )
          ),
          state.showModal() && m(Modal, { state, mdl }),

          m(
            "section",
            m("label", "Contents"),
            m("#jodit", {
              onupdate: (e) => (state.text = state.jodit.value),
              oncreate: ({ dom }) => {
                state.jodit = new Jodit(dom, {
                  autofocus: true,
                  uploader: {
                    insertImageAsBase64URI: true,
                  },
                  toolbarButtonSize: "large",
                  defaultActionOnPaste: "insert_clear_html",
                })
              },
            })
          ),

          m(
            "nav.container.grouped.is-center",
            m(
              m.route.Link,
              {
                selector: "button.button.secondary",
                href: "/social/blog",
              },
              "Cancel"
            ),
            m(
              "button.button.primary",
              {
                disabled: isInvalid(),
                onclick: (e) => {
                  e.preventDefault()
                  submitBlog(mdl)(state)
                },
              },
              state.objectId ? "Update" : "Submit"
            ),
            state.isEditing() &&
              m(
                "button.button.error",
                { onclick: (e) => deleteBlog(mdl) },
                "Delete"
              )
          )
        )
      )
    },
  }
}

export default BlogEditor
