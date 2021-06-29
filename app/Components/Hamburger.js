import { WindowCloseLine, MenuLine } from "@mithril-icons/clarity"

const Hamburger = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(".pointer", [
        mdl.state.isAuth() &&
          m("label", `Welcome ${mdl.user.name.split(" ")[0]}`),
        m(
          ".icon-click.",
          mdl.state.showNavModal() ? m(WindowCloseLine) : m(MenuLine)
        ),
      ]),
  }
}

export default Hamburger
