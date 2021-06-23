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
          "ul.nav-left",
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
        mdl.state.isAuth() &&
          m(
            "nav",
            m(
              "ul.nav-center",
              m(
                "li",
                m(
                  m.route.Link,
                  {
                    selector: "a",
                    href: "/social/blog-editor:",
                    role: "button",
                  },
                  "Add A Blog Post"
                )
              )
            )
          ),

        mdl.settings.screenSize == "desktop"
          ? m(".nav-right", m(AuthBox, { mdl }))
          : m(
              "ul.nav-right",
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
