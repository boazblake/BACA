import m from "mithril"
import NavLink from "@/Components/nav-link.js"
// import { SlideUp } from '@/Styles/animations.js'

const updateNavigationStyle = (dom, showNav) => {
  let hide = { position: "unset", top: 0 }
  let show = { position: "sticky", top: "70px" }
  if (dom) {
    return showNav
      ? (dom.classList.replace('fade', "fadeOut"), hide)
      : (dom.classList.replace("fadeOut", 'fade'), show)
  } else {
    return showNav ? hide : show
  }
}

const closeSubNav = mdl => ({ target, y }) => {
  target.classList.replace('fade', "fadeOut")
  y >= target.getBoundingClientRect().bottom && setTimeout(() => mdl.state.showingSubnav(false))
}

const isActiveRoute = (a, b) => (a == b ? "active" : "")
const state = { navDom: null }
const SubNavbar = () => {
  const subroutes = (mdl) =>
    mdl.Routes.filter((r) => r.isNav && r.group.includes(mdl.state.navState()))

  return {
    view: ({ attrs: { mdl } }) =>
      mdl.state.showingSubnav() &&
      subroutes(mdl).any() &&

      m(
        `nav#navigation.nav.nav-center.animated.fade`,
        {
          onremove: state.navDom = null,
          oncreate: ({ dom }) => (state.navDom = dom),
          // onbeforeremove: SlideUp,
          style: updateNavigationStyle(state.navDom, mdl.state.showNavMenu()),
          onmouseout: closeSubNav(mdl),
        },
        m(
          "nav.nav#sub-navbar.nav-right.animated.fade",
          subroutes(mdl).map((r, key) =>
            r.group.includes("external")
              ? m(
                `a.clear.nav-link.large-font`,
                { key, target: "_blank", href: r.external },
                r.name)
              : m(NavLink, {
                key,
                mdl,
                href: r.route,
                link: r.name,
                classList: `large-font clear nav-link ${isActiveRoute(
                  mdl.state.subnavState(),
                  r.route
                )}`,
              })
          )
        ))
  }
}

export default SubNavbar
