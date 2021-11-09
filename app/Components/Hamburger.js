import { WindowCloseLine, MenuLine } from "@mithril-icons/clarity/cjs"

const filledGreen = { fill: "green" }

const Hamburger = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m("figure.pointer is-center", { style: { transform: "scale(1.2)" } }, [
        mdl.state.isAuth() &&
          m("label", `Welcome ${mdl.user.name && mdl.user.name.split(" ")[0]}`),
        mdl.state.showNavModal()
          ? m(WindowCloseLine, filledGreen)
          : m(MenuLine, filledGreen),
      ]),
  }
}

export default Hamburger
