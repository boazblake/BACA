import m from "mithril"
import {
  exists, toWebpFormat, toUploadB64, resizeImageTask
} from "@/Utils"
import {
  resetModalState,
  resetEditorState,
  isInvalid,
  saveImgToGalleryTask,
  deleteBlog,
  onInput,
} from "./fns"
import Stream from "mithril-stream"
import Editor from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import { prop } from "ramda"


export const state = {
  show: Stream(false),
  status: "loading",
  objectId: null,
  title: "",
  author: "",
  text: "",
  img: null,
  thumb: "",
  file: null,
  imageId: null,
  showModal: Stream(false),
  images: [],
  modalState: Stream("upload"),
  showPreview: Stream(false),
  isEditing: Stream(false),
  showHelp: Stream(false),
  modalIsDisabled: s => !s.img,
  errors: {
    img: null,
  },
}

const getGallery = ({ attrs: { mdl } }) => {
  const onError = (e) => log("getGallery - error")(e)
  const onSuccess = ({ results }) => (state.images = results)
  mdl.http.back4App.getTask(mdl)("gallery").fork(onError, onSuccess)
}

const fetchBlog = state => ({ attrs: { mdl } }) => {
  const onError = (e) => {
    log("fetchBlog error")(e)
    state.status = "error"
    e.code == 404 && m.route.set("/social/blog")
  }
  const onSuccess = ({ title, text, img, thumb, objectId, imageId }) => {
    state.title = title
    state.text = text
    state.img = img
    state.thumb = thumb
    state.objectId = objectId
    state.imageId = imageId
    state.status = "loaded"
    state.show(true)
  }
  let id = mdl.blogpost

  if (exists(id)) {
    state.isEditing(true)
    mdl.http.back4App
      .getTask(mdl)(`blogs/${id}`).map(prop('results'))
      .fork(onError, onSuccess)
  } else {
    state.status = "loaded"
    state.show(true)
  }
}




const addImageBlobHook = (file, cb) => toWebpFormat(file).then(cb)


const initEditor =
  (state, mdl) =>
    ({ dom }) => {
      state.editor = new Editor({
        autofocus: true,
        viewer: true,
        height: `500px`,
        el: dom,
        initialValue: state.text,
        initialHTML: state.text,
        placeholder: 'Add some text',
        hooks: { addImageBlobHook },
        events: {
          change: () => {
            // console.log(state.editor.getMarkdown())
            // if (!equals(state.text.length, state.editor.getMarkdown().length))
            state.text = state.editor.getMarkdown()
          }
        }
      })
      // console.log(state.editor)

      // state.editor.then((e) => e.setData(state.text))
    }

const handleImage = (mdl) => (state) =>
  state.img ? uploadImage(mdl)(state.img) : state.showModal(false)

const uploadImage = (mdl) => (file) => {
  const onError = (e) => (state.errors.img = e)
  const onSuccess = ({ image, thumb, objectId }) => {
    state.img = image
    state.thumb = thumb
    state.imageId = objectId
    state.showModal(false)
  }



  resizeImageTask(file)
    .chain(saveImgToGalleryTask(mdl)).map(prop('results'))
    .fork(onError, onSuccess)
}

const submitBlog =
  (mdl) =>
    ({ title, img, text, thumb, objectId, imageId }) => {
      const onError = (e) => console.log("e", e)
      const onSuccess = id => (data) => {
        const route = id ? id : data.results.objectId
        m.route.set(`/social/blog-post/${route}`)
      }

      let dto = {
        title,
        img,
        text,
        author: mdl.user.name,
        thumb,
        imageId,
      }
      const updateOrSubmitBlog = objectId
        ? mdl.http.back4App.putTask(mdl)(`blogs/${objectId}`)(dto)
        : mdl.http.back4App.postTask(mdl)("blogs")(dto)

      updateOrSubmitBlog.fork(onError, onSuccess(objectId))
    }

const assignImg = (img, thumb, objectId) => {
  if (state.img == img) {
    state.img = null
    state.thumb = null
    state.imageId = null
  } else {
    state.img = img
    state.thumb = thumb
    state.imageId = objectId
  }
  state.showModal(false)
}

export const Modal = () => {
  return {
    onremove: () => resetModalState(state),
    oninit: getGallery,
    view: ({ attrs: { mdl } }) =>
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
                ? m("input", { type: "file", id: "file", onchange: e => state.img = e.target.files[0] })
                : state.images.map(({ image, thumb, objectId }) =>
                  m(
                    `figure.col-6.button.${thumb == state.thumb ? "primary" : "outline"
                    }`,
                    {
                      onclick: (e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        assignImg(image, thumb, objectId)
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
                  disabled: state.modalIsDisabled(state),

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
    oninit: fetchBlog(state),
    view: ({ attrs: { mdl } }) => {
      return m(
        ".grid",
        // state.status == "loading" && m(Loader),
        state.status == "error" && m("p", "Error - redirecting"),
        (state.status =
          "loaded" &&
          m(
            "form.container",
            { ...onInput(state) },
            m(
              "section",
              m(
                "label",
                "Title",

                m("input", { id: "title", value: state.title })
              )
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
                      state.thumb = null
                      state.img = null
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

            state.show() && m(
              "section",
              m("#editor.fr-view", {
                oncreate: initEditor(state, mdl),
              })
            ),

            m(
              "nav.container.grouped.is-center",
              m(
                m.route.Link,
                {
                  selector: "button.button.secondary",
                  href: state.objectId
                    ? `/social/blog-post/${state.objectId}`
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
                    deleteBlog(mdl)(state)
                  },
                },
                "Delete"
              )
            )
          ))
      )
    },
  }
}

export default BlogEditor

