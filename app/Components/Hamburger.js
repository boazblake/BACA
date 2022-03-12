import { WindowCloseLine, MenuLine } from "@mithril-icons/clarity/cjs"

const filledGreen = { fill: "green" }

const Hamburger = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "figure.pointer is-center",
        {
          onclick: () => mdl.state.showNavModal(!mdl.state.showNavModal()),
          style: {
            ...(mdl.settings.screenSize == "phone" && { margin: "auto" }),
            transform: "scale(1.2)",
          },
        },
        mdl.state.showNavModal()
          ? m(WindowCloseLine, filledGreen)
          : m(MenuLine, filledGreen)
      ),
  }
}

export default Hamburger
