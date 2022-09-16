import m from "mithril"
import { exists } from "@/Utils"
import {
  resetModalState,
  resetEditorState,
  isInvalid,
  saveImgToGalleryTask,
  deleteBlog,
  onInput,
} from "./fns"
import Loader from "@/Components/loader.js"
import Stream from "mithril-stream"
import Editor from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'


const state = {
  show: Stream(false),
  status: "loading",
  objectId: null,
  title: "",
  author: "",
  text: "",
  img: "",
  thumb: "",
  file: null,
  imageId: null,
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
  const onError = (e) => log("fetchBlogImages - error")(e)
  const onSuccess = ({ results }) => (state.images = results)
  mdl.http.back4App.getTask(mdl)("Classes/Gallery").fork(onError, onSuccess)
}

const fetchBlog = state => ({ attrs: { mdl } }) => {
  const onError = (e) => {
    log("fetchBlog error")(e)
    state.status = "error"
    e.code == 404 && m.route.set("/social/blog")
  }
  const onSuccess = ({ title, text, img, thumb, objectId }) => {
    state.title = title
    state.text = text
    state.img = img
    state.thumb = thumb
    state.objectId = objectId
    state.status = "loaded"
    state.show(true)
  }

  let id = m.route.get().split(":")[1]
  if (exists(id)) {
    state.isEditing(true)
    mdl.http.back4App
      .getTask(mdl)(`Classes/Blogs/${id}`)
      .fork(onError, onSuccess)
  } else {
    state.status = "loaded"
    state.show(true)
  }
}

const getBase64 = file => {
  return new Promise((res, rej) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => res(reader.result))
    reader.readAsDataURL(file)
  })
}

const resizeBase64Img = (base64, newWidth, newHeight) => {
  return new Promise((res, rej) => {
    const canvas = document.createElement("canvas");
    // canvas.style.width = newWidth.toString() + "%";
    // canvas.style.height = newHeight.toString() + "%";
    const context = canvas.getContext("2d");
    const img = document.createElement("img");
    img.src = base64;
    img.onload = function () {
      canvas.width = img.width / 3;
      canvas.height = img.height / 3;
      // context.drawImage(img, 0, 0);
      // canvas.toBlob(
      //   (blob) => {
      //     if (blob === null) {
      //       return rej(blob);
      //     } else {
      //       res(canvas.toDataUrl(blob));
      //     }
      //   },
      //   "image/jpeg",
      //   1 / 2
      // );
      context.scale(.3, .3)
      // context.scale(newWidth / img.width, newHeight / img.height);
      context.drawImage(img, 0, 0);
      console.log(canvas.style)
      return res(canvas.toDataURL());
    }

  })
}

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
        hooks: { addImageBlobHook: (x, cb) => { console.log('x', cb); getBase64(x).then(b64 => resizeBase64Img(b64, 50, 50)).then(cb) } },
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
  state.file ? uploadImage(mdl)(state.file) : state.showModal(false)

const uploadImage = (mdl) => (file) => {
  const onError = (e) => (state.errors.img = e)
  const onSuccess = ({ image, thumb, objectId }) => {
    state.img = image
    state.thumb = thumb
    state.imageId = objectId
    state.showModal(false)
  }

  mdl.http.imgBB
    .postTask(mdl)(file)
    .chain(saveImgToGalleryTask(mdl))
    .fork(onError, onSuccess)
}

const submitBlog =
  (mdl) =>
    ({ title, img, text, thumb, objectId, imageId }) => {
      const onError = (e) => console.log("e", e)
      const onSuccess = (data) =>
        m.route.set(`/social/blog-post:${objectId ? objectId : data.objectId}`)

      let dto = {
        title,
        img,
        text,
        author: mdl.user.name,
        thumb,
        imageId,
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
                    `figure.col-6.button.${thumb == state.thumb ? "primary" : "outline"
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
    oninit: fetchBlog(state),
    view: ({ attrs: { mdl } }) => {
      return m(
        ".grid",
        state.status == "loading" && m(Loader),
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

