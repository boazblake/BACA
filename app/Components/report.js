import { CameraLine } from "@mithril-icons/clarity"
import { FadeBack } from "Styles/animations"

const state = {
  date: "",
  time: "",
  location: "",
  subject: "",
  message: "",
  firstName: "",
  lastName: "",
  email: "",
  image: null,
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
            "formgroup.grouped",
            m(
              "label",
              "Date",
              m("input", {
                type: "date",
                oninput: (e) => (state.date = e.target.value),
              })
            ),
            m(
              "label",
              "Time",
              m("input", {
                type: "time",
                oninput: (e) => (state.time = e.target.value),
              })
            )
          ),

          m(
            "formgroup",
            m(
              "label",
              "Location",
              m("input", {
                oninput: (e) => (state.location = e.target.value),
              })
            ),

            m(
              "label",
              "Subject",
              m("input", {
                oninput: (e) => (state.subject = e.target.value),
              })
            ),

            m(
              "label",
              "Message",
              m("input", {
                oninput: (e) => (state.message = e.target.value),
              })
            )
          ),

          m(
            "formgroup.grouped",
            m(
              "label",
              "First Name",
              m("input", {
                oninput: (e) => (state.firstName = e.target.value),
              })
            ),
            m(
              "label",
              "Last Name",
              m("input", {
                oninput: (e) => (state.lastName = e.target.value),
              })
            )
          ),
          m(
            "formgroup",
            m(
              "label",
              "Email",
              m("input", {
                oninput: (e) => (state.email = e.target.value),
              })
            ),

            m(
              "label.grouped",
              m("input", {
                oninput: (e) => (state.images = e.target.files),
                onchange: (e) => handleUploadedImages(),
                type: "file",
                id: "files",
                // multiple: true,
              }),
              state.image &&
                m("input", {
                  type: "image",
                  src: state.image,
                })
            )
          )
        ),
        m(
          ".modal-footer.is-right grouped",
          m(
            "button.button.primary",
            {
              onclick: (e) => {
                e.preventDefault()
                submitReport(mdl)
              },
            },
            "Submit Report"
          ),
          m(
            "button.button.secondary",
            {
              onclick: (e) => {
                e.preventDefault()
                showModal(false)
              },
            },
            "cancel"
          )
        )
      )
    ),
}

export default ViolationReport
