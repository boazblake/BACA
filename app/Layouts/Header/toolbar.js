import Hamburger from "Components/Hamburger.js"
import AuthBox from "Components/authbox.js"

const Toolbar = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        ".toolbar.grid",
        m(
          ".col",
          m("img.nav-logo", {
            src: "Images/logo.webp",
          })
        ),
        mdl.settings.screenSize == "desktop"
          ? m(".col", m(AuthBox, { mdl }))
          : m(
              ".grid.grid-end",
              {
                onclick: () => mdl.state.showNavModal(true),
              },
              m(Hamburger, {
                mdl,
              })
            )
      ),
  }
}

export default Toolbar
