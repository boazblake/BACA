import { WindowCloseLine, BarsLine } from "@mithril-icons/clarity"

const Hamburger = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      mdl.state.isAuth()
        ? m("span.pointer", [
            m("span", `Welcome ${mdl.user.name.split(" ")[0]}`),
            m(
              ".icon-click.",
              mdl.state.showNavModal() ? m(WindowCloseLine) : m(BarsLine)
            ),
          ])
        : m(
            "span.pointer",
            mdl.state.showNavModal() ? m(WindowCloseLine) : m(BarsLine)
          ),
  }
}

export default Hamburger
