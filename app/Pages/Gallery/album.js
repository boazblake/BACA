import m from "mithril"
import Loader from "@/Components/loader.js"
import { startsWith, traverse, prop, reverse, uniqWith, eqBy, compose, map } from "ramda"
import { exists, confirmTask } from "@/Utils"
import Task from "data.task"
import { TimesCircleLine, ArrowLine } from "@mithril-icons/clarity/cjs"
import Stream from "mithril-stream"
import { resizeImageTask } from "../../Utils/helpers"

export const state = {
  album: [],
  title: "",
  showSelectedImage: Stream(),
  addImagesModal: Stream(false),
  isUpLoading: Stream(false),
  modalState: {
    imgFiles: [],
    selectedImgs: [],
    previewImgs: [],
    isDisabled: s => !exists(Object.values(s.modalState.selectedImgs))

  },
}

const resetModalState = (state) => {
  state.modalState = {
    imgFiles: [],
    selectedImgs: [],
    previewImgs: [],
    isDisabled: s => !exists(Object.values(s.modalState.selectedImgs))
  }
}

const deleteImageTask =
  (mdl) =>
    ({ objectId }) =>
      mdl.http.back4App.deleteTask(mdl)(`gallery/${objectId}`)

const deleteAlbum = (mdl) => {
  const onError = (e) => console.error(e)
  const onSuccess = () => m.route.set("/social/gallery")
  confirmTask(`Are you sure you want to delete Album ${state.title}?`)
    .chain((_) => mdl.http.back4App.deleteTask(mdl)(`gallery/album/${state.title}`))
    .fork(onError, onSuccess)
}

const deleteImg = (mdl, pic) => {

  const onError = (e) => {
    log("deleteImg - error")(e)
  }
  const onSuccess = () => fetchAlbum({ attrs: { mdl } })

  confirmTask("Are you sure you want to delete this Image?")
    .chain((_) => deleteImageTask(mdl)(pic))
    .fork(onError, onSuccess)
}

const fetchAlbum = ({ attrs: { mdl } }) => {
  const albumName = m.route.get().split(":")[1].replaceAll("%20", " ")
  const onError = (e) => {
    log("fetchAlbum - error")(e)
  }
  const onSuccess = (results) => {
    results.any()
      ? ((state.album = results), (state.title = albumName))
      : m.route.set("/social/gallery")
  }

  mdl.http.back4App
    .getTask(mdl)(`gallery/${albumName}`)
    .map(prop("results"))
    .fork(onError, onSuccess)
}


const submitImages = (mdl, images) => {
  const onSuccess = (d) => {
    fetchAlbum({ attrs: { mdl } })
    state.isUpLoading(false)
    state.addImagesModal(false)
  }
  const onError = (e) => {
    console.error("e", e);
    state.isUpLoading(false)
  }
  state.isUpLoading(true)

  Object.values(images).traverse(resizeImageTask, Task.of)
    .chain(mdl.http.back4App.postTask(mdl)(`gallery/${state.title}`))
    .fork(
      onError,
      onSuccess
    )
}

const selectImg = (src, file) => {
  state.modalState.selectedImgs[src]
    ? (delete state.modalState.selectedImgs[src])
    : (state.modalState.selectedImgs[src] = file)
}

const handleUploadedImages = () => {
  const createObUrl = (file) => ({ file, src: URL.createObjectURL(file) })

  state.modalState.previewImgs = Array.from(state.modalState.imgFiles)
    .filter((file) => startsWith("image/", prop("type", file)))
    .map(createObUrl)
}

export const AddImagesModal = () => {
  return {
    onremove: () => resetModalState(state),
    view: ({ attrs: { mdl } }) =>
      m(
        "section.modal-container",
        m(
          "article.modal.card.grid",
          !state.isUpLoading() && m(
            "header.modal-header",
            m("h2", "Drag and drop or add using the button")
          ),
          m(
            "section.modal-content",
            state.isUpLoading()
              ? [m("p", "PROCESSING IMAGES... PLEASE BE PATIENT"), m(Loader)]
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
                      `figure.button.col-4.${state.modalState.selectedImgs[src]
                        ? "primary"
                        : "outline"
                      }`,
                      {
                        onclick: (e) => selectImg(src, file),
                      },
                      m("img", {
                        alt: "",

                        src,
                      })
                    )
                  )
                )
              )
          ),
          !state.isUpLoading() && m(
            "section.modal-footer.grouped",
            m(
              "button",
              { onclick: () => state.addImagesModal(false) },
              "Cancel"
            ),
            m(
              "button",
              {
                onclick: (e) =>
                  submitImages(mdl, state.modalState.selectedImgs),
                role: "button",
                type: "submit",
                disabled: state.modalState.isDisabled(state),
              },
              "Upload"
            ),
            state.modalState.isDisabled(state) && m('', 'You must select at least one photo to upload')
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
              selector: "button.button.clear.icon",
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
                onclick: (e) => state.addImagesModal(true),
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
        ),
        m(
          "section.container",
          m("h2", state.title.toLocaleUpperCase()),
          m(
            ".row",
            state.album.map((pic, key) =>
              m(
                "figure.is-center.col-4.pos-rel",
                { key },
                mdl.state.isAuth() &&
                m(TimesCircleLine, {
                  class: "pointer bg-white pos-abs",
                  style: { borderRadius: "50%", top: 0, right: "20%" },
                  fill: "red",
                  onclick: (e) => deleteImg(mdl, pic),
                }),
                m("img.pointer", {
                  src: pic.thumb,
                  onclick: (e) => {
                    mdl.modal.content(
                      m("img.is-center", {
                        style: { height: "100%", margin: "0 auto" },
                        src: pic.image,
                        alt: "",
                      })
                    )
                    mdl.toggleLayoutModal(mdl)
                  },
                })
              )
            )
          )
        )
      ),
}

export default Album

