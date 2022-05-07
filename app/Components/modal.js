const Modal = {
  view: ({ attrs: { classList, isActive, mdl } }) => {
    return m(
      `section.modal.${classList}`,
      { class: isActive ? "active" : "", id: "modal" },
      [
        m(
          ".modal-overlay",
          {
            "aria-label": "Close",
            onclick: () => mdl.state.showLayoutModal(false),
          },
          m(
            ".modal-container",
            m("header.modal-header", mdl.modal.header()),
            m(".modal-body", m(".content", mdl.modal.content())),
            m(".modal-footer", mdl.modal.footer())
          )
        ),
      ]
    )
  },
}

export default Modal
