import m from "mithril"
import { compose, groupBy, prop } from "ramda"

const state = {
  albums: [],
  showModal: Stream(false),
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
    state.showModal(false)
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
      {
        id: "modal-container",
        onclick: (e) =>
          e.target.id == "modal-container" && state.showModal(false),
      },
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
              type: "file",
              oninput: (e) => {
                state.newAlbum.img = e.target.files[0]
              },
            })
          )
        ),
        m(
          ".modal-footer.is-right grouped",
          m(
            "button.button.primary",
            {
              onclick: (e) => {
                e.preventDefault()
                createtNewAlbum(mdl)
              },
            },
            "Create Album"
          ),
          m(
            "button.button.secondary",
            {
              onclick: (e) => {
                e.preventDefault()
                state.showModal(false)
              },
            },
            "cancel"
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
            ".row",
            Object.keys(state.albums).map((album) =>
              m(AlbumCover, { mdl, album: state.albums[album][0] })
            )
          )
        ),
}

export default Gallery
