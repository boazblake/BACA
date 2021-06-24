import NavLink from "Components/nav-link.js"

const isActiveRoute = (a, b) => (a == b ? "active" : "")

const Navbar = () => {
  const routes = (mdl) => mdl.Routes.filter((r) => r.group.includes("navmenu"))
  const subroutes = (mdl) =>
    mdl.Routes.filter((r) =>
      r.group.includes(mdl.state.navState().split("/")[1])
    )
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "nav.nav#navbar.is-full-width",
        routes(mdl).map((r) =>
          m(NavLink, {
            mdl,
            href: r.route,
            link: r.name,
            classList: `clear ${isActiveRoute(mdl.state.navState(), r.route)}`,
          })
        )
      ),
  }
}

export default Navbar
