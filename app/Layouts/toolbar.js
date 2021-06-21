import Hamburger from "Components/Hamburger.js"
import AuthBox from "Components/authbox.js"
import NavModal from "./nav-modal.js"
import { SlideOutRight, SlideInLeft } from "Styles/animations.js"

const showNavMenu = (mdl) =>
  mdl.settings.screenSize !== "desktop" && mdl.state.showNavModal()

const Toolbar = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "nav#toolbar.navigation",
        m(
          "ul",
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
              "ul",
              {
                onclick: () =>
                  mdl.state.showNavModal(!mdl.state.showNavModal()),
              },
              m(Hamburger, {
                mdl,
              })
            ),
        showNavMenu(mdl) &&
          m(NavModal, {
            oncreate: SlideInLeft,
            onbeforeremove: SlideOutRight,
            mdl,
          })
      ),
  }
}

export default Toolbar
