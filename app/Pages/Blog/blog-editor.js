import { exists } from "Utils"
import {
  resetModalState,
  resetEditorState,
  isInvalid,
  saveImgToGalleryTask,
  deleteBlog,
  onInput,
  toBlogs,
} from "./fns"

const state = {
  objectId: null,
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
    state.editor.then((e) => e.setData(text))
  }

  let id = m.route.get().split(":")[1]
  if (exists(id)) {
    state.isEditing(true)
    mdl.http.back4App
      .getTask(mdl)(`Classes/Blogs/${id}`)
      .fork(onError, onSuccess)
  }
}

const initEditor =
  (state) =>
  ({ dom }) => {
    state.editor = ClassicEditor.create(dom, {
      toolbar: [
        "heading",
        "selectAll",
        "undo",
        "redo",
        "bold",
        "italic",
        "blockQuote",
        "link",
        "indent",
        "outdent",
        "numberedList",
        "bulletedList",
        "mediaEmbed",
        "insertTable",
        "tableColumn",
        "tableRow",
        "mergeTableCells",
      ],
      heading: {
        options: [
          {
            model: "paragraph",
            title: "Paragraph",
            class: "ck-heading_paragraph",
          },
          {
            model: "heading1",
            view: "h1",
            title: "Heading 1",
            class: "ck-heading_heading1",
          },
          {
            model: "heading2",
            view: "h2",
            title: "Heading 2",
            class: "ck-heading_heading2",
          },
        ],
      },
    })

    state.editor.then((e) => e.setData(state.text))
  }

const handleImage = (mdl) => (state) =>
  state.file ? uploadImage(mdl)(state.file) : state.showModal(false)

const uploadImage = (mdl) => (file) => {
  const onError = (e) => (state.errors.img = e)
  const onSuccess = ({ image, thumb }) => {
    state.img = image
    state.thumb = thumb
    state.showModal(false)
  }

  const image = new FormData()
  image.append("image", file)
  mdl.http.imgBB
    .postTask(mdl)(image)
    .chain(saveImgToGalleryTask(mdl))
    .fork(onError, onSuccess)
}

const submitBlog =
  (mdl) =>
  ({ title, img, text, thumb, objectId }) => {
    const onError = (e) => console.log("e", e)
    const onSuccess = (data) =>
      m.route.set(`/social/blog-post:${objectId ? objectId : data.objectId}`)

    let dto = {
      title,
      img,
      text,
      author: mdl.user.name,
      thumb,
    }
    const updateOrSubmitBlog = objectId
      ? mdl.http.back4App.putTask(mdl)(`Classes/Blogs/${objectId}`)(dto)
      : mdl.http.back4App.postTask(mdl)("Classes/Blogs")(dto)

    updateOrSubmitBlog.fork(onError, onSuccess)
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
                    handleImage(mdl)(state)
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
  return {
    onremove: () => resetEditorState(state),
    oninit: setupEditor,
    view: ({ attrs: { mdl } }) => {
      return m(
        ".grid",
        m(
          "form.container",
          { ...onInput(state) },
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
            m("#editor.fr-view", {
              onupdate: (e) =>
                state.editor.then((e) => (state.text = e.getData())),
              oncreate: initEditor(state),
            })
          ),

          m(
            "nav.container.grouped.is-center",
            m(
              m.route.Link,
              {
                selector: "button.button.secondary",
                href: state.objectId
                  ? `/social/blog-post:${state.objectId}`
                  : `/social/blog`,
              },
              "Cancel"
            ),
            m(
              "button.button.primary",
              {
                disabled: isInvalid(state),
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
                {
                  onclick: (e) => {
                    e.preventDefault()
                    deleteBlog(mdl)(state.objectId)
                  },
                },
                "Delete"
              )
          )
        )
      )
    },
  }
}

export default BlogEditor
