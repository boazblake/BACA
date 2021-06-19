import Toolbar from "./toolbar.js"
import Navbar from "./navbar.js"

const HeroImage = {
  view: ({ attrs: { mdl } }) =>
    m(
      ".hero",
      m("img", {
        src: "images/main.webp",
        style: { width: "100%", margin: "0 auto" },
      })
    ),
}

const Header = ({ attrs: { mdl } }) => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        ".grid#header",
        m(Toolbar, { mdl }),
        m(HeroImage, { mdl }),
        mdl.settings.screenSize == "desktop" && m(Navbar, { mdl })
      ),
  }
}

export default Header
