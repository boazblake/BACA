import Hamburger from "Components/Hamburger.js"
import AuthBox from "Components/authbox.js"

const Toolbar = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "nav#toolbar.sticky-nav.nav.is-horizontal-align",
        {
          style: {
            "background-color": mdl.state.showNavModal()
              ? "rgba(255, 255, 255, 1)"
              : "rgba(255, 255, 255, 0.9)",
          },
        },
        m(
          ".nav-left.is-left",
          m(
            "figure.pointer",
            m(m.route.Link, {
              selector: "img",
              href: "/",
              src: "images/logo.webp",
            })
          )
        ),

        mdl.settings.screenSize == "desktop"
          ? m(".nav-right", m(AuthBox, { mdl }))
          : m(
              ".nav-right",
              {
                onclick: () =>
                  mdl.state.showNavModal(!mdl.state.showNavModal()),
              },
              m(Hamburger, {
                mdl,
              })
            )
      ),
  }
}

export default Toolbar
