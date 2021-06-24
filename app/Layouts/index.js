import Hero from "./hero.js"
import Navbar from "./navbar.js"
import SubNavbar from "./subnavbar.js"
import Main from "./main.js"
import Footer from "./footer.js"
import NavModal from "./nav-modal.js"
import { SlideOutRight, SlideInLeft } from "Styles/animations.js"
import Toolbar from "./toolbar.js"

const showNavMenu = (mdl) =>
  mdl.settings.screenSize !== "desktop" && mdl.state.showNavModal()

const Layout = () => {
  return {
    view: ({ children, attrs: { mdl } }) =>
      m(
        "#layout",
        { "data-theme": "light", id: "layout", role: "main" },
        m(Toolbar, { mdl }),
        m(Hero, { mdl }),
        mdl.settings.screenSize == "desktop" &&
          m("nav.navigation", m(Navbar, { mdl }), m(SubNavbar, { mdl })),

        m(Main, { mdl, children }),
        showNavMenu(mdl) &&
          m(NavModal, {
            oncreate: SlideInLeft,
            onbeforeremove: SlideOutRight,
            mdl,
          }),
        m(Footer, { mdl })
      ),
  }
}

export default Layout
