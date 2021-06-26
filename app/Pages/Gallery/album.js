const state = { album: [], title: "" }

const fetchAlbum = ({ attrs: { mdl } }) => {
  let album = m.route.get().split(":")[1]
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

const Album = {
  oninit: fetchAlbum,
  view: ({ attrs: { mdl } }) =>
    m(
      ".container",
      m(
        "nav",
        m(
          m.route.Link,
          { selector: "button", href: "/social/gallery", class: "primary" },
          "Back To Gallery"
        )
      ),
      m("h2", state.title.toUpperCase()),
      mdl.state.isLoading()
        ? "LOADING"
        : m(
            ".row",
            state.album.map((pic) =>
              m(
                "figure.col-4",
                m("img", { src: pic.thumb })
                // m("figcaption", pic.caption)
              )
            )
          )
    ),
}

export default Album
