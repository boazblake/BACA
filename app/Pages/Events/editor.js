import { m } from "mithril"
import { log } from "Utils"
import { exists, handlers } from "Utils"

const onInput = (event) =>
  handlers(["oninput"], (e) => {
    console.log(e.target.type)
    if (e.target.type == "checkbox") {
      return (event[e.target.id] = JSON.parse(e.target.checked))
    }
    if (e.target.id == "file") {
      return (event[e.target.id] = e.target.files[0])
    } else {
      return (event[e.target.id] = e.target.value)
    }
  })

const data = {
  status: null,
  locations: [],
}

const Editor = {
  view: ({
    attrs: {
      mdl,
      showEditor,
      deleteEvent,
      submitEvent,
      resetState,
      state,
      uploadImage,
    },
  }) =>
    m(
      "aside.modal-container",
      m(
        "article.modal",
        m(
          "section.modal-content.container",
          m(
            "form.grid",
            { ...onInput(state.event) },
            m(
              "formgroup.grouped",
              m(
                "label",
                "Start Date",
                m("input", {
                  type: "date",
                  id: "startDate",
                  value: state.event.startDate,
                })
              ),
              m(
                "label",
                "Start Time",
                m("input", {
                  type: "time",
                  id: "startTime",
                  value: state.event.startTime,
                  pattern: "(?:[01]|2(?![5-9])){1}d{1}:[0-5]{1}d{1}",
                })
              )
            ),
            m(
              "formgroup",
              m(
                "label",
                "All Day Event?",
                m("input", {
                  type: "checkbox",
                  id: "allDay",
                  value: state.event.allDay,
                  checked: state.event.allDay,
                })
              )
            ),
            m(
              "formgroup.grouped",
              m(
                "label",
                "End Date",
                m("input", {
                  type: "date",
                  id: "endDate",
                  value: state.event.endDate,
                })
              ),
              m(
                "label",
                "End Time",
                m("input", {
                  type: "time",
                  id: "endTime",

                  value: state.event.endTime,
                })
              )
            ),
            m(
              "formgroup",
              m(
                "label",
                "Title",
                m("input", {
                  type: "text",
                  id: "title",
                  value: state.event.title,
                })
              )
            ),
            state.status() == "uploading-image"
              ? m("h2.tag.is-center", "Attaching Image - please be patient")
              : m(
                  "formgroup.grouped",
                  m(
                    "label",
                    "Upload an Image",
                    m("input", {
                      type: "file",
                      id: "file",
                      value: state.files,
                      onchange: () => uploadImage(state.event.file),
                    }),
                    state.event.image &&
                      m("img", {
                        src: state.event.image,
                      })
                  )
                ),

            m(
              "label.icon",
              "Location",
              m("input", {
                oninput: (e) => {
                  if (e.target.value.length > 3) {
                    data.status = "isloading"
                    mdl.http.openCage
                      .getLocationTask(mdl)(e.target.value.trim())
                      .fork(
                        (e) => {
                          data.status = "error"
                          log("error fetching locations")(e)
                        },
                        ({ results }) => {
                          data.status = "loaded"
                          data.locations = results
                        }
                      )
                  }
                },
                id: "location",
                value: state.event.location,
              })
            ),
            data.locations.any() &&
              m(
                "details.dropdown",
                m("summary.button.outline", "options"),
                m(
                  ".card",
                  m(
                    "ul",

                    data.locations.map(({ formatted }) =>
                      m(
                        "li.pointer",
                        { onclick: (e) => (state.event.location = formatted) },
                        formatted
                      )
                    )
                  )
                )
              ),
            m(
              "formgroup",
              m(
                "label",
                "Description",
                m("textarea", {
                  id: "description",
                  value: state.event.description,
                })
              )
            )
          )
        ),

        m(
          "footer.modal-footer",
          m(
            ".tabs.grouped.is-center",
            m(
              "button.button",
              {
                onclick: () => {
                  resetState(state)
                  showEditor(false)
                },
              },
              "Cancel"
            ),
            state.event.id &&
              m(
                "button.button.error",
                {
                  onclick: (e) => {
                    deleteEvent(mdl, state.event.id)
                  },
                  role: "button",
                },
                "Delete"
              ),
            m(
              "button.button.primary",
              {
                onclick: (e) => {
                  submitEvent(mdl, state.event)
                },
                role: "button",
              },
              "Submit"
            )
          )
        )
      )
    ),
}

export default Editor
