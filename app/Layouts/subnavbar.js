import m from "mithril"
import NavLink from "@/Components/nav-link.js"

const isActiveRoute = (a, b) => (a == b ? "active" : "")

const SubNavbar = () => {
  const subroutes = (mdl) =>
    mdl.Routes.filter((r) => r.isNav && r.group.includes(mdl.state.navState()))

  return {
    view: ({ attrs: { mdl } }) =>
      subroutes(mdl).any() &&
      m(
        "nav.nav#sub-navbar.nav-right.animated.fade",
        subroutes(mdl).map((r, key) =>
          r.group.includes("external")
            ? m(
              "a.clear.nav-link.large-font",
              { key, target: "_blank", href: r.external },
              r.name)
            : m(NavLink, {
              key,
              mdl,
              href: r.route,
              link: r.name,
              classList: `large-font clear ${isActiveRoute(
                mdl.state.subnavState(),
                r.route
              )}`,
            })
        )
      ),
  }
}

export default SubNavbar
