import Hamburger from "Components/Hamburger.js"
import AuthBox from "Components/authbox.js"

import { listOf } from "Utils/helpers"

const handler = (mdl) => (entries) => {
  entries.forEach((el) => {
    if (el.isIntersecting) {
      mdl.state.fab(el.intersectionRect.height * 1.2)
      // console.log(mdl.state.fab())
    } else {
      // console.log(mdl.state.fab())
      mdl.state.fab(el.intersectionRect.height * 2)
    }
  })
}

const toolbarObserver = (handler) =>
  new IntersectionObserver(handler, {
    threshold: listOf(20)
      .map((i, idx) => (idx + 1) / 20)
      .reverse()
      .concat(0)
      .reverse(),
  })

const Toolbar = () => {
  return {
    oncreate: ({ attrs: { mdl }, dom }) => {
      toolbarObserver(handler(mdl)).observe(dom)
    },

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
