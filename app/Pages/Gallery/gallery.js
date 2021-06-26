import m from "mithril"
import { compose, groupBy, prop } from "ramda"

const state = {
  albums: [],
  showNewAlbumModal: Stream(false),
  newAlbum: { title: "", img: "" },
}

const groupByAlbum = compose(groupBy(prop("album")), prop("results"))

const fetchAllAlbums = ({ attrs: { mdl } }) => {
  const onError = (e) => console.log(e)
  const onSuccess = (albums) => (state.albums = albums)

  mdl.http.back4App
    .getTask(mdl)("Classes/Gallery")
    .map(groupByAlbum)
    .fork(onError, onSuccess)
}

const saveImgToGalleryTask =
  (mdl) =>
  ({ data: { image, medium, thumb } }) =>
    mdl.http.back4App.postTask(mdl)("Classes/Gallery")({
      album: state.newAlbum.title,
      image: image.url,
      // medium: medium.url,
      thumb: thumb.url,
    })

const createtNewAlbum = (mdl) => {
  const onError = (e) => console.log(e)
  const onSuccess = () => {
    state.newAlbum = { title: "", img: "" }
    state.showNewAlbumModal(false)
    fetchAllAlbums({ attrs: { mdl } })
  }

  const image = new FormData()
  image.append("image", state.newAlbum.img)
  mdl.http.imgBB
    .postTask(mdl)(image)
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
        class: "button clear card col-4",
        href: `social/gallery/album:${album}`,
      },
      m("img", { src: thumb }),
      m("figcaption", album)
    ),
}

const NewAlbumModal = {
  view: ({ attrs: { mdl } }) =>
    m(
      ".modal-container",
      m(
        ".modal.card",
        m(
          "form",
          m(
            "label",
            "Album Title",
            m("input", {
              oninput: (e) => (state.newAlbum.title = e.target.value),
            })
          ),
          m(
            "label",
            "Add A Photo",
            m("input", {
              type: "file",
              oninput: (e) => (state.newAlbum.img = e.target.files[0]),
            })
          ),
          m(
            ".footer.is-right",
            m(
              "button",
              {
                onclick: (e) => {
                  e.preventDefault()
                  state.showNewAlbumModal(false)
                },
              },
              "cancel"
            ),
            m(
              "button",
              {
                onclick: (e) => {
                  e.preventDefault()
                  createtNewAlbum(mdl)
                },
              },
              "Create Album"
            )
          )
        )
      )
    ),
}

const Gallery = {
  oninit: fetchAllAlbums,
  view: ({ attrs: { mdl } }) =>
    mdl.state.isLoading()
      ? m("article.modal", "LOADING")
      : m(
          ".container",
          mdl.state.isAuth() &&
            m(
              "nav.nav",
              m(
                ".nav-left",
                m(
                  "button",
                  {
                    onclick: (e) => state.showNewAlbumModal(true),
                    class: "button primary",
                  },
                  "Add A New Album"
                ),
                state.showNewAlbumModal() && m(NewAlbumModal, { mdl })
              )
            ),
          m(
            ".row",
            Object.keys(state.albums).map((album) =>
              m(AlbumCover, { mdl, album: state.albums[album][0] })
            )
          )
        ),
}

export default Gallery
