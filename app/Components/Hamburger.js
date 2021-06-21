import { WindowCloseLine, BarsLine } from "@mithril-icons/clarity"

const Hamburger = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        ".container-fluid",
        mdl.state.isAuth()
          ? m("span", [
              m("span", `Welcome ${mdl.user.name.split(" ")[0]}`),
              m(
                ".icon-click.",
                mdl.state.showNavModal() ? m(WindowCloseLine) : m(BarsLine)
              ),
            ])
          : m(
              ".icon-click.",
              mdl.state.showNavModal() ? m(WindowCloseLine) : m(BarsLine)
            )
      ),
  }
}

export default Hamburger
