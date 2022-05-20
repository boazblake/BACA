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
                    maxHeight: "50vh",
                    overflow: "auto",
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
