import { handlers, exists } from "Utils"
import Task from "data.task"

const state = {
  title: "",
  author: "",
  text: "",
  img: "",
  thumb: "",
  file: null,
  showModal: Stream(false),
  errors: {
    img: null,
  },
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
    console.log("id", exists(id))
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
  ({ data: { image, medium, thumb } }) => {
    mdl.http.back4App.postTask(mdl)("Classes/Gallery")({
      album: "blog",
      image: image.url,
      medium: medium.url,
      thumb: thumb.url,
    })
    return Task.of({ image: image.url, medium: medium.url, thumb: thumb.url })
  }

const uploadImage = (mdl) => (file) => {
  const image = new FormData()
  image.append("image", file)
  mdl.http.imgBB
    .postTask(mdl)(image)
    .chain(saveImgToGalleryTask(mdl))
    .fork(onSubmitError, onImgSuccess)
}

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

const deleteBlog = (mdl) =>
  mdl.http.back4App
    .deleteTask(mdl)(`Classes/Blogs/${state.objectId}`)
    .fork(toBlogs, toBlogs)

const BlogEditor = (mdl) => {
  const onInput = handlers(["oninput"], (e) => {
    if (e.target.id == "file") {
      state[e.target.id] = e.target.files[0]
    } else {
      state[e.target.id] = e.target.value
    }
  })

  return {
    oninit: setupEditor,
    view: ({ attrs: { mdl } }) =>
      m(
        ".grid",
        m(
          "form",
          { ...onInput },
          m(
            "p",
            m("label", "Title"),
            m("input", { id: "title", value: state.title })
          ),

          m(
            "button.secondary",
            {
              onclick: () => state.showModal(!state.showModal()),
            },
            state.thumb ? "Update Image" : "Add An Image"
          ),
          state.thumb && m("aside", m("img", { src: state.thumb })),
          state.showModal() &&
            m(
              "section.modal-container",
              m(
                "article.container",
                m("header", m(".grid", m("a", "Upload"), m("a", "Select"))),
                m("form", m("input", { type: "file", id: "file" })),
                m(
                  "footer",
                  m(
                    ".grid",
                    m(
                      "button",
                      { onclick: () => state.showModal(false) },
                      "Cancel"
                    ),
                    m(
                      "button",
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
              )
            ),
          m(
            "p",
            m("label", "Contents"),
            m("textarea", {
              value: state.text,
              id: "text",
              style: { height: "300px" },
            })
          ),
          m(
            "nav.grid",
            m("button", { onclick: toBlogs }, "Cancel"),
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
      ),
  }
}

export default BlogEditor
