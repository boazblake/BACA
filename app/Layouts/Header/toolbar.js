import Hamburger from "Components/Hamburger.js"
import AuthBox from "Components/authbox.js"

const Toolbar = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        ".toolbar.grid",
        mdl.settings.screenSize == "desktop"
          ? m(AuthBox, { mdl })
          : m(
              ".col",
              {
                onclick: () => mdl.state.showNavModal(true),
              },
              m(Hamburger, {
                mdl,
              })
            ),
        m(
          ".col.col-grow-2",
          m(
            ".grid.grid-end",
            m("img.nav-logo", {
              src: "images/BonhamAcresIcon.webp",
            })
          )
        )
      ),
  }
}

export default Toolbar
