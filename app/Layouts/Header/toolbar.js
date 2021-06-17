import Hamburger from "Components/Hamburger.js"
import AuthBox from "Components/authbox.js"

const Toolbar = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        ".toolbar.grid",
        m(
          ".col.col-grow-2",
          m(
            ".grid.grid-start",
            m("img.nav-logo", {
              src: "images/BonhamAcresIcon.webp",
            })
          )
        ),
        mdl.settings.screenSize == "desktop"
          ? m(AuthBox, { mdl })
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
