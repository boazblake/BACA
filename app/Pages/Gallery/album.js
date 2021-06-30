import { prop, startsWith, traverse } from "ramda"
import { exists } from "Utils"
import Task from "data.task"
import { TimesCircleLine, ArrowLine } from "@mithril-icons/clarity"
const state = {
  album: [],
  title: "",
  showModal: Stream(false),
  modalState: {
    imgFiles: [],
    selectedImgs: [],
    previewImgs: [],
  },
}

const resetModalState = (state) => {
  state.modalState = {
    imgFiles: [],
    selectedImgs: [],
    previewImgs: [],
  }
}

const deleteImageTask =
  (mdl) =>
  ({ objectId }) =>
    mdl.http.back4App.deleteTask(mdl)(`Classes/Gallery/${objectId}`)

const deleteAlbum = (mdl) => {
  // let album = m.route.get().split(":")[1].replaceAll("%20", " ")
  // let byAlbumName = encodeURI(`where={"album":"${album}"}`)
  // mdl.http.back4App
  //   .deleteTask(mdl)(`Classes/Gallery?${byAlbumName}`)
  const onError = (e) => console.error(e)
  const onSuccess = () => m.route.set("/social/gallery")
  traverse(Task.of, deleteImageTask(mdl), state.album).fork(onError, onSuccess)
}

const deleteImg = (mdl, pic) => {
  // console.log(pic)
  const onError = (e) => console.log(e)
  const onSuccess = () => fetchAlbum({ attrs: { mdl } })

  deleteImageTask(mdl)(pic).fork(onError, onSuccess)
}

const fetchAlbum = ({ attrs: { mdl } }) => {
  let album = m.route.get().split(":")[1].replaceAll("%20", " ")
  let byAlbumName = encodeURI(`where={"album":"${album}"}`)
  const onError = (e) => console.log(e)
  const onSuccess = ({ results }) => {
    state.album = results
    state.title = album
  }

  mdl.http.back4App
    .getTask(mdl)(`Classes/Gallery?${byAlbumName}`)
    .fork(onError, onSuccess)
}

const saveImgToGalleryTask =
  (mdl) =>
  ({ data: { image, thumb } }) =>
    mdl.http.back4App.postTask(mdl)("Classes/Gallery")({
      album: state.title,
      image: image.url,
      thumb: thumb.url,
    })

const uploadImage = (mdl) => (file) => {
  const image = new FormData()
  image.append("image", file)
  return mdl.http.imgBB.postTask(mdl)(image).chain(saveImgToGalleryTask(mdl))
}

const submitImages = (mdl, images) => {
  const onSuccess = (d) => {
    fetchAlbum({ attrs: { mdl } })
    state.showModal(false)
  }

  const onError = (e) => console.error("e", e)
  traverse(Task.of, uploadImage(mdl), Object.values(images)).fork(
    onError,
    onSuccess
  )
}

const selectImg = (src, file) => {
  state.modalState.selectedImgs[src]
    ? (state.modalState.selectedImgs[src] = null)
    : (state.modalState.selectedImgs[src] = file)
}

const handleUploadedImages = () => {
  const createObUrl = (file) => ({ file, src: URL.createObjectURL(file) })

  state.modalState.previewImgs = Array.from(state.modalState.imgFiles)
    .filter((file) => startsWith("image/", prop("type", file)))
    .map(createObUrl)
}

const Modal = () => {
  return {
    onremove: () => resetModalState(state),
    view: ({ attrs: { mdl } }) =>
      m(
        "section.modal-container",
        {
          id: "modal-container",
          onclick: (e) => {
            e.target.id == "modal-container" && state.showModal(false)
          },
        },
        m(
          "article.modal.card.grid",
          m(
            "header.modal-header",
            m("h2", "Drag and drop or add using the button")
          ),
          m(
            "section.modal-content",
            mdl.state.isLoading()
              ? m("p", "PROCESSING IMAGES... PLEASE BE PATIENT")
              : m(
                  "form.grid",
                  m("input", {
                    oninput: (e) =>
                      (state.modalState.imgFiles = e.target.files),
                    onchange: (e) => handleUploadedImages(),
                    type: "file",
                    id: "files",
                    multiple: true,
                  }),
                  m(
                    ".row",
                    state.modalState.previewImgs.map(({ src, file }) =>
                      m(
                        `figure.button.col-4.${
                          state.modalState.selectedImgs[src]
                            ? "primary"
                            : "outline"
                        }`,
                        {
                          onclick: (e) => selectImg(src, file),
                        },
                        m("img", {
                          src,
                        })
                      )
                    )
                  )
                )
          ),
          m(
            "section.modal-footer",
            m("button", { onclick: () => state.showModal(false) }, "Cancel"),
            m(
              "button",
              {
                onclick: (e) =>
                  submitImages(mdl, state.modalState.selectedImgs),
                role: "button",
                type: "submit",
                disabled: !exists(Object.values(state.modalState.selectedImgs)),
              },
              "Upload"
            )
          )
        )
      ),
  }
}

const Album = {
  oninit: fetchAlbum,
  view: ({ attrs: { mdl } }) =>
    m(
      ".container",
      m(
        "nav.grouped.m-y-6",
        m(
          m.route.Link,
          {
            selector: "button.button.primary.outline.icon",
            href: "/social/gallery",
            class: "primary",
          },
          m(ArrowLine, { style: { transform: "rotate(270deg)" } }),
          "Back To Blogs"
        ),
        mdl.state.isAuth() && [
          m(
            "button.button.primary",
            {
              onclick: (e) => state.showModal(true),
            },
            "Add more Images to Album"
          ),
          m(
            "button.button error",
            {
              onclick: (e) => {
                deleteAlbum(mdl)
              },
            },
            "Delete Album"
          ),
        ],
        state.showModal() && m(Modal, { mdl })
      ),
      m("h2", state.title.toLocaleUpperCase()),
      mdl.state.isLoading()
        ? "LOADING"
        : m(
            ".row",
            state.album.map((pic) =>
              m(
                "figure.col-4",
                mdl.state.isAuth() &&
                  m(TimesCircleLine, {
                    class: "pointer",
                    fill: "red",
                    onclick: (e) => deleteImg(mdl, pic),
                  }),
                m("img", { src: pic.thumb })
              )
            )
          )
    ),
}

export default Album
