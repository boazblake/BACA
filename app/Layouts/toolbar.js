import m from "mithril"
import Hamburger from "@/Components/Hamburger.js"
import AuthBox from "@/Components/authbox.js"
import { ScrollToPageTitle, bellIcon } from "@/Utils"
import Toasts from "@/Components/toast"
import Navbar from "./navbar.js"
import SubNavbar from "./subnavbar.js"

const state = {
  navDom: null
}

const updateNavigationStyle = (dom, showNav) => {
  console.log(dom, showNav)
  let hide = { position: "unset", }
  let show = { position: "sticky", }
  if (dom) {
    return showNav
      ? () => (dom.classList.add("fadeOut"), hide)
      : () => (dom.classList.remove("fadeOut"), show)
  } else {
    return showNav ? hide : show
  }
}

const AuthDisplay = ({ attrs: { mdl } }) => {
  let route = mdl.state.hasNotifications()
    ? `${mdl.user.routename}#MESSAGES`
    : mdl.user.routename
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        m.route.Link,
        { href: `/account/${route}`, selector: "a.underline.pointer.outline" },
        `Welcome ${mdl.user.name?.split(" ")[0]}`,
        mdl.state.hasNotifications() &&
        m('span', { height: "24px", fill: "green" }, bellIcon)
      ),
  }
}

export default {
  view: ({ attrs: { mdl } }) =>
    m(
      "nav#toolbar.sticky-nav.is-horizontal-align",
      {
        style: {
          "background-color": mdl.state.showNavModal()
            ? "rgba(255, 255, 255, 1)"
            : "rgba(255, 255, 255, 0.9)",
        },
      },
      m(
        ".nav-left.is-left",
        m(
          "figure.pointer",
          m(m.route.Link, {
            selector: "img",
            alt: "logo",
            id: "nav-logo",
            href: "/",
            src: "images/baca-logo.webp",
          })
        )
      ),

      mdl.settings.screenSize == "desktop"
        ? [
          mdl.settings.screenSize == "desktop" &&
          // m(
          //   `animated`,
          //   {
          //     oncreate: ({ dom }) => (state.navDom = dom),
          //     style: updateNavigationStyle(state.navDom, mdl.state.showNavMenu()),
          //   },
          !mdl.state.showNavMenu() && m(Navbar, { mdl }),
          // ),
          m(
            ".nav-right is-right",
            mdl.state.showNavMenu() &&
            m(
              "Button.button success m-r-16",
              { onclick: () => ScrollToPageTitle() },
              "Menu"
            ),
            m(AuthBox, { mdl })
          )]
        : m(
          ".nav-right is-right.grouped",
          mdl.state.isAuth() && m(AuthDisplay, { mdl }),
          m(Hamburger, { mdl })
        ),
      m(Toasts)
    ),
}

