const Event = {
  onremove: ({ attrs: { resetState, state } }) => resetState(state),
  view: ({ attrs: { mdl, event, previewEvent } }) =>
    m(
      ".modal-container",
      m(
        ".modal",
        m("section.modal-content container", JSON.stringify(event)),
        m(
          "footer.modal-footer",
          m(
            ".tabs grouped",
            m(
              "button.button.primary.is-full-width",
              { onclick: () => previewEvent(false) },
              "Done"
            ),
            mdl.state.isAuth() &&
              m(
                "button.button.primary.is-full-width",
                {
                  onclick: (e) => {},
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

export default Event
