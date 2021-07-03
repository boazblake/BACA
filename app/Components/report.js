import { FadeBack } from "Styles/animations"

const state = {
  date: "",
  time: "",
  location: "",
  subject: "",
  message: "",
  images: [],
}

const ViolationReport = {
  view: ({ attrs: { mdl, showModal } }) =>
    m(
      ".modal-container",
      {
        id: "modal-container",
        onclick: (e) => e.target.id == "modal-container" && showModal(false),
      },
      m(
        "form.modal.card",
        m(
          "section.modal-content",
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

export default ViolationReport
