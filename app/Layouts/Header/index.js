import Toolbar from "./toolbar.js"
import Navbar from "./navbar.js"

const Header = ({ attrs: { mdl } }) => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        ".grid#header",
        m(Toolbar, { mdl }),
        mdl.settings.screenSize == "desktop" && m(Navbar, { mdl })
      ),
  }
}

export default Header
