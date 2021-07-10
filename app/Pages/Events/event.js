const Event = {
  view: ({
    attrs: { mdl, event, previewEvent, editEvent, resetState, state },
  }) =>
    m(
      ".modal-container",
      m(
        ".modal",
        m(
          "section.modal-content container card",
          m(".grouped", m("label", event.startDate), m("label", event.endDate)),
          m(".grouped", m("label", event.startTime), m("label", event.endTime)),
          event.allDay &&
            m(".grouped", m("label.tag.primary", "All Day Event")),
          m(".grouped", m("label", event.title)),
          m(".grouped", m("label", event.image)),
          m(".grouped", m("label", event.description))
        ),
        m(
          "footer.modal-footer",
          m(
            ".tabs grouped",
            mdl.state.isAuth() &&
              m(
                "button.button.secondary.is-full-width",
                {
                  onclick: (e) => {
                    previewEvent(false)
                    editEvent(true)
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
