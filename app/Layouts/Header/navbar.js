import Hamburger from "Components/Hamburger.js"
import { isActiveRoute } from "Utils/index.js"

const NavBar = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        ".navbar.grid",
        mdl.settings.screenSize !== "desktop"
          ? m(
              ".col",
              {
                onclick: () => {
                  mdl.state.showNavModal(true)
                  console.log(mdl.state.showNavModal())
                },
              },
              m(Hamburger, {
                mdl,
              })
            )
          : m(".col", "Members"),
        m(".col.col-grow-2", "LOGO"),
        m(".col", "Safety")
      ),
  }
}

export default NavBar
