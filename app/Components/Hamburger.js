import { WindowCloseLine, MenuLine } from "@mithril-icons/clarity/cjs"

const filledGreen = { fill: "green" }

const Hamburger = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "figure.pointer is-center",
        {
          onclick: () => mdl.state.showNavModal(!mdl.state.showNavModal()),
          style: { transform: "scale(1.2)" },
        },
        mdl.state.showNavModal()
          ? m(WindowCloseLine, filledGreen)
          : m(MenuLine, { height: "20px", ...filledGreen })
      ),
  }
}

export default Hamburger
