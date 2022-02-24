import Loader from "Components/loader.js"
import { compose, groupBy, prop } from "ramda"

const state = {
  albums: [],
  showModal: Stream(false),
  newAlbum: { title: "", img: null },
}

const groupByAlbum = compose(groupBy(prop("album")), prop("results"))

const fetchAllAlbums = ({ attrs: { mdl } }) => {
  const onError = (e) => log("fetchAllAlbums- error")(e)
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
  const onError = (e) => log("createtNewAlbum- error")(e)
  const onSuccess = () => {
    state.newAlbum = { title: "", img: "" }
    state.showModal(false)
    fetchAllAlbums({ attrs: { mdl } })
  }

  mdl.http.imgBB
    .postTask(mdl)(state.newAlbum.img)
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
      m("img", { src: thumb }),
      m("figcaption", album)
    ),
}

const NewAlbumModal = {
  view: ({ attrs: { mdl } }) =>
    m(
      ".modal-container",
      m(
        "form.modal.card",
        m(
          "section.modal-content",
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
          ".modal-footer.is-right grouped",
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
                createtNewAlbum(mdl)
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
    mdl.state.isLoading()
      ? m(Loader)
      : m(
          "article.grid.p-y-6.fade",
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
                state.showModal() && m(NewAlbumModal, { mdl })
              )
            ),
          m(
            "section.row.container",
            Object.keys(state.albums).map((album) =>
              m(AlbumCover, { mdl, album: state.albums[album][0] })
            )
          )
        ),
}

export default Gallery
