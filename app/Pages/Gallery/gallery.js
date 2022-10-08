import { groupBy, compose, prop, descend, ascend, sortWith } from "ramda"
import Stream from "mithril-stream"
import m from "mithril"
import { resizeImageTask } from "../../Utils/helpers"


export const state = {
  albums: [],
  showModal: Stream(false),
  newAlbum: { title: "", img: null },
}

const groupByAlbum = groupBy(prop("album"))

const sortByUpdatedAlbum = sortWith([
  descend(prop("updatedAt")),
  ascend(prop("album")),
])

const groupByAlbumAndDate = compose(groupByAlbum, sortByUpdatedAlbum)

const fetchAllAlbums = ({ attrs: { mdl } }) => {
  const onError = (e) => log("fetchAllAlbums- error")(e)
  const onSuccess = (albums) => (state.albums = albums)

  mdl.http.back4App
    .getTask(mdl)("gallery")
    .map(prop("results"))
    .map(groupByAlbumAndDate)
    .fork(onError, onSuccess)
}

const saveImgToGalleryTask =
  (mdl) => img =>
    mdl.http.back4App.postTask(mdl)("gallery")({
      album: state.newAlbum.title.trim(),
      image: img,
    })

const createNewAlbum = (mdl) => {
  const onError = (e) => log("createNewAlbum- error")(e)
  const onSuccess = () => {
    state.newAlbum = { title: "", img: "" }
    state.showModal(false)
    fetchAllAlbums({ attrs: { mdl } })
  }

  resizeImageTask(state.newAlbum.img)
    .chain(saveImgToGalleryTask(mdl))
    .fork(onError, onSuccess)
}

const AlbumCover = {
  view: ({
    attrs: {
      album: { thumb, album },
    },
  }) =>
    m(
      m.route.Link,
      {
        selector: "figure",
        class: "button card col-4 bg-white",
        href: `social/gallery/album:${album}`,
      },
      m("img", {
        alt: "",
        src: thumb,
      }),
      m("figcaption", album)
    ),
}

export const NewAlbumModal = {
  view: ({ attrs: { mdl } }) =>
    m(
      "aside.modal-container",
      m('article.modal',
        m(
          "section.modal-content.container",
          m(
            "label",
            "Album Title",
            m("input", {
              oninput: (e) => {
                state.newAlbum.title = e.target.value
              },
            })
          ),
          m(
            "label",
            "Add A Photo",
            m("input", {
              oninput: (e) => (state.newAlbum.img = e.target.files[0]),
              type: "file",
              id: "files",
            })
          )
        ),
        m(
          ".footer.modal-footer.is-right grouped",
          m(
            "button.button.secondary",
            {
              onclick: (e) => {
                e.preventDefault()
                state.showModal(false)
              },
            },
            "cancel"
          ),

          m(
            "button.button.primary",
            {
              disabled: !state.newAlbum.img,
              onclick: (e) => {
                e.preventDefault()
                createNewAlbum(mdl)
              },
            },
            "Create Album"
          )
        )
      )
    ),
}

const Gallery = {
  oninit: fetchAllAlbums,
  view: ({ attrs: { mdl } }) =>
    m(
      "article.fade",
      mdl.state.isAuth() &&
      m(
        "nav.nav",
        m(
          ".nav-center",
          m(
            "button.button.primary",
            {
              onclick: (e) => state.showModal(true),
              class: mdl.settings.screenSize == "phone" ? "col-12" : "",
            },
            "Add A New Album"
          ),
        )
      ),
      m(
        ".row.container-fluid",
        Object.keys(state.albums).map((album, key) =>
          m(AlbumCover, { key, mdl, album: state.albums[album][0] })
        )
      )
    ),
}

export default Gallery

