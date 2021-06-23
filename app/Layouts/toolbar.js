import Hamburger from "Components/Hamburger.js"
import AuthBox from "Components/authbox.js"

const Toolbar = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "nav#toolbar.navigation.nav",
        {
          style: {
            "background-color": mdl.state.showNavModal()
              ? "rgba(255, 255, 255, 1)"
              : "rgba(255, 255, 255, 0.9)",
          },
        },
        m(
          ".nav-left",
          m(
            m.route.Link,
            {
              onclick: () => m.route.set("/about"),
            },
            m("img#nav-logo", {
              src: "images/logo.webp",
            })
          )
        ),
        mdl.state.isAuth() &&
          m(
            ".nav-center",

            m(
              m.route.Link,
              {
                href: "/social/blog-editor:",
                class: "button primary",
              },
              "Add A Blog Post"
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
