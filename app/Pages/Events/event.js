const Event = {
  view: ({
    attrs: { mdl, event, previewEvent, editEvent, resetState, state },
  }) =>
    m(
      ".modal-container",
      m(
        ".modal",
        m(
          "header.modal-header",
          m("h2.tag", event.title),
          m(".grouped", m("label", event.startDate), m("label", event.endDate)),
          m(".grouped", m("label", event.startTime), m("label", event.endTime)),
          event.allDay &&
            m(".grouped", m("label.tag.primary", "All Day Event")),
          m(".grouped", m("img", { src: event.image }))
        ),

        m(
          "section.modal-content container card",

          m(".grouped", m("label", event.description))
        ),
        m(
          "footer.modal-footer",
          m(
            ".tabs grouped",
            (event.createdBy == mdl.user.name || mdl.user.isAdmin) &&
              m(
                "button.button.secondary.is-full-width",
                {
                  onclick: (e) => {
                    editEvent(true)
                    previewEvent(false)
                    e.preventDefault()
                  },
                  role: "button",
                  disabled: false,
                },
                "Edit"
              ),
            m(
              "button.button.primary.is-full-width",
              {
                onclick: () => {
                  resetState(state)
                  mdl.state.selectedPreviewEvent(null)
                  previewEvent(false)
                },
              },
              "Done"
            )
          )
        )
      )
    ),
}

export default Event
