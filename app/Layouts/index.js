import Hero from "./hero.js"
import Navbar from "./navbar.js"
import SubNavbar from "./subnavbar.js"
import Main from "./main.js"
import Footer from "./footer.js"
import Toolbar from "./toolbar.js"

const Layout = () => {
  return {
    view: ({ children, attrs: { mdl } }) =>
      m(
        ".",
        { "data-theme": "light", id: "layout", role: "main" },
        m(Toolbar, { mdl }),
        m(Hero, { mdl }),
        mdl.settings.screenSize == "desktop" && [
          m(Navbar, { mdl }),
          m(SubNavbar, { mdl }),
        ],

        m(Main, { mdl, children }),
        m(Footer, { mdl })
      ),
  }
}

export default Layout
