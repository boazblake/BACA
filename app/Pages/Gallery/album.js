import Loader from "Components/loader.js"
import { prop, startsWith, traverse } from "ramda"
import { exists } from "Utils"
import Task from "data.task"
import { TimesCircleLine, ArrowLine } from "@mithril-icons/clarity/cjs"
const state = {
  album: [],
  title: "",
  showModal: Stream(false),
  isUpLoading: Stream(false),
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
  const onError = (e) => log("deleteImg - error")(e)
  const onSuccess = () => fetchAlbum({ attrs: { mdl } })

  deleteImageTask(mdl)(pic).fork(onError, onSuccess)
}

const fetchAlbum = ({ attrs: { mdl } }) => {
  let album = m.route.get().split(":")[1].replaceAll("%20", " ")
  let byAlbumName = encodeURI(`where={"album":"${album}"}`)
  const onError = (e) => {
    log("fetchAlbum - error")(e)
  }
  const onSuccess = ({ results }) => {
    results.any()
      ? ((state.album = results), (state.title = album))
      : m.route.set("/social/gallery")
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

const uploadImage = (mdl) => (file) =>
  mdl.http.imgBB.postTask(mdl)(file).chain(saveImgToGalleryTask(mdl))

const submitImages = (mdl, images) => {
  state.isUpLoading(true)
  const onSuccess = (d) => {
    fetchAlbum({ attrs: { mdl } })
    state.isUpLoading(false)
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
        m(
          "article.modal.card.grid",
          m(
            "header.modal-header",
            m("h2", "Drag and drop or add using the button")
          ),
          m(
            "section.modal-content",
            state.isUpLoading()
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
            "section.modal-footer.grouped",
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
    mdl.state.isLoading() && !state.isUpLoading()
      ? m(Loader)
      : m(
          "article.grid.p-y-6.fade.",
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
              "Back To Gallery"
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
          m(
            "section.container",
            m("h2", state.title.toLocaleUpperCase()),
            m(
              ".row",
              state.album.map((pic, idx) =>
                m(
                  "figure.is-center.col-4.pos-rel",
                  mdl.state.isAuth() &&
                    m(TimesCircleLine, {
                      class: "pointer bg-white pos-abs",
                      style: { borderRadius: "50%", top: 0, right: "20%" },
                      fill: "red",
                      onclick: (e) => deleteImg(mdl, pic),
                    }),
                  m("img.pointer", {
                    src: pic.thumb,
                    // onclick: showImage(pic, idx)
                  })
                )
              )
            )
          )
        ),
}

export default Album
