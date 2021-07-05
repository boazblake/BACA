import { exists, handlers } from "Utils"

const onInput = (event) =>
  handlers(["oninput"], (e) => {
    if (e.target.id == "file") {
      event[e.target.id] = e.target.files[0]
    } else {
      event[e.target.id] = e.target.value
    }
  })

const Editor = {
  onremove: ({ attrs: { resetState, state } }) => resetState(state),
  view: ({
    attrs: {
      mdl,
      state: { event },
      showEditor,
      submitEvent,
    },
  }) =>
    m(
      "aside.modal-container",
      m(
        "article.modal",
        m(
          "section.modal-content",
          m(
            "form",
            { ...onInput(event) },
            m(
              "formgroup",
              m(
                "label",
                "Start Date",
                m("input", {
                  type: "date",
                  id: "startDate",
                  value: event.startDate,
                  disabled: event.id && exists(event.id),
                })
              ),
              m(
                "label",
                "End Date",
                m("input", {
                  type: "date",
                  id: "endDate",
                  value: event.endDate,
                  disabled: event.id && exists(event.id),
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
                  value: event.allDay,
                  disabled: event.id && exists(event.id),
                })
              )
            ),
            m(
              "formgroup.grouped",
              m(
                "label",
                "Start Time",
                m("input", {
                  type: "time",
                  id: "startTime",
                  value: event.startTime,
                  disabled: event.id && exists(event.id),
                })
              ),
              m(
                "label",
                "End Time",
                m("input", {
                  type: "time",
                  id: "endTime",

                  value: event.endTime,
                  disabled: event.id && exists(event.id),
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
                  value: event.title,
                  disabled: event.id && exists(event.id),
                })
              )
            ),
            m(
              "formgroup",
              m(
                "label",
                "Description",
                m("textarea", {
                  id: "description",
                  value: event.description,
                  disabled: event.id && exists(event.id),
                })
              )
            )
          )
        ),
        m(
          "footer.modal-footer",
          m(
            ".tabs grouped",
            m("button.button", { onclick: () => showEditor(false) }, "Cancel"),
            m(
              "button.button.primary",
              {
                onclick: (e) => submitEvent(mdl, event),
                role: "button",
                disabled: false,
              },
              "Submit"
            )
          )
        )
      )
    ),
}

export default Editor
