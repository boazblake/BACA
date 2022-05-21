const scaleWidth = (mdl) => {
  switch (mdl.settings.screenSize) {
    case "phone":
      return "scale(1.3)"
    case "wide":
      return "scale(1.2)"
    case "tablet":
      return "scale(1.1)"
    case "desktop":
      return "scale(1)"
  }
}

const Modal = {
  onremove: ({ attrs: { mdl } }) => {
    mdl.modal.header(null)
    mdl.modal.content(null)
    mdl.modal.footer(null)
    mdl.modal.classList(null)
  },
  view: ({ attrs: { mdl } }) => {
    return m(
      `section.modal.${mdl.modal.classList()}`,
      m(
        ".modal-overlay",
        {
          "aria-label": "Close",
          onclick: (e) => mdl.state.showLayoutModal(false),
        },
        m(
          ".modal-container",
          m(
            ".card.container.grid",
            {
              style: {
                maxHeight: "800px",
                overflow: "auto",
                transform: `${scaleWidth(mdl)}`,
              },
              onclick: (e) => {
                e.preventDefault()
                e.stopPropagation()
              },
            },
            m("header.modal-header.row", mdl.modal.header()),
            m(
              ".modal-body.row",
              m(
                "",
                {
                  style: {
                    maxHeight: "90vh",
                    wordBreak: "break-word",
                  },
                },
                mdl.modal.content()
              )
            ),
            m(".modal-footer.row", mdl.modal.footer())
          )
        )
      )
    )
  },
}

export default Modal
