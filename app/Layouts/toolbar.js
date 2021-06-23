import Hamburger from "Components/Hamburger.js"
import AuthBox from "Components/authbox.js"

const Toolbar = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "nav#toolbar.navigation",
        {
          style: {
            "background-color": mdl.state.showNavModal()
              ? "rgba(255, 255, 255, 1)"
              : "rgba(255, 255, 255, 0.9)",
          },
        },
        m(
          "ul",
          m(
            m.route.Link,
            {
              selector: "li.pointer",
              onclick: () => m.route.set("/about"),
            },
            m("img#nav-logo", {
              src: "images/logo.webp",
            })
          )
        ),
        mdl.settings.screenSize == "desktop"
          ? m(AuthBox, { mdl })
          : m(
              "ul",
              {
                onclick: () =>
                  mdl.state.showNavModal(!mdl.state.showNavModal()),
              },
              m(
                "li",
                m(Hamburger, {
                  mdl,
                })
              )
            )
      ),
  }
}

export default Toolbar
