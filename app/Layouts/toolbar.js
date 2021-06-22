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
        m(
          "ul.container",
          m(
            "li",
            m("img#nav-logo", {
              src: "images/logo.webp",
            })
          )
        ),
        mdl.settings.screenSize == "desktop"
          ? m(AuthBox, { mdl })
          : m(
              "ul.container",
              {
                onclick: () =>
                  mdl.state.showNavModal(!mdl.state.showNavModal()),
              },
              m(
                ".container-fluid",
                m(Hamburger, {
                  mdl,
                })
              )
            )
      ),
  }
}

export default Toolbar
