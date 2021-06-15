import { AngleLine } from "@mithril-icons/clarity"
import NavLink from "Components/nav-link"
import { log, isActiveRoute } from "Utils/index.js"

let navItemstate = {
  onHover: () => {},
}

const toggleRoutes = (mdl) => (id) => {
  let keys = Object.keys(mdl.navState)
  keys.map((k) => id !== k && mdl.navState[k](false))
  mdl.navState[id](!mdl.navState[id]())
}

const NavItem = () => {
  return {
    view: ({ attrs: { mdl, href, link, classList } }) =>
      m(
        `li.nav-item`,
        m(NavLink, { mdl, ...navItemstate, href, link, classList })
      ),
  }
}

const getChildRoutes = (mdl, routeIds) =>
  mdl.Routes.filter((r) => routeIds.includes(r.id))

const NavSection = ({ attrs: { mdl, route, toggleRoutes } }) => {
  let childRoutes = getChildRoutes(mdl, route.children)
  return {
    view: ({ attrs: { isSelected } }) =>
      m(
        ".nav-section",
        {
          onclick: (e) => toggleRoutes(mdl)(route.id),
        },
        m(
          ".grid",
          m(".col-9", route.name),
          m(
            ".col-3",
            m(AngleLine, {
              style: { transform: `rotate(${isSelected() ? 180 : 0}deg)` },
            })
          ),
          isSelected()
            ? childRoutes.map((r) =>
                m(
                  ".",
                  r.group.includes("external")
                    ? m("a.p-8", { target: "_blank", href: r.external }, r.name)
                    : m(NavItem, {
                        mdl,
                        href: r.route,
                        link: r.name,
                        classList: `p-8 grid-between ${isActiveRoute(r.route)}`,
                      })
                )
              )
            : m("")
        )
      ),
  }
}

const NavModal = ({ attrs: { mdl } }) => {
  const routes = (mdl) => mdl.Routes.filter((r) => r.group.includes("navmenu"))
  let _domOverlay
  let _domModal

  return {
    view: ({ attrs: { mdl } }) =>
      m(
        ".modalOverlay-left.animated",
        {
          oncreate: ({ dom }) => (_domOverlay = dom),
          onclick: (e) => {
            //     log("e")(e.target)
            //     log("dom")(_domModal)
            if ([_domModal, _domOverlay].includes(e.target))
              mdl.state.showNavModal(false)
          },
        },
        m(
          `.modal`,
          {
            oncreate: ({ dom }) => (_domModal = dom),
            id: "nav-modal",
          },

          m("ul.nav", { id: "" }, [
            mdl.state.isAuth()
              ? [
                  mdl.user.isAdmin &&
                    m(NavLink, {
                      mdl,
                      href: `/dashboard/${mdl.user.name}`,
                      link: "Dashboard",
                      classList: `${isActiveRoute(
                        `/dashboard/${mdl.user.name}`
                      )} button`,
                    }),
                  m(NavLink, {
                    state,
                    mdl,
                    href: `/account/${mdl.user.name}`,
                    link: "Your Account",
                    classList: `${isActiveRoute(
                      `/account/${mdl.user.name}`
                    )} button`,
                  }),
                  m(NavLink, {
                    mdl,
                    href: "/logout",
                    link: "Logout",
                    onclick: () => {
                      // localStorage.clear()
                      // sessionStorage.clear()
                      // mdl.state.isAuth(false)
                      // mdl.user = {}
                      // mdl.cart = cart
                      // m.route.set(m.route.get())
                    },
                    classList: "bold auth-link",
                  }),
                ]
              : m(".grid", [
                  m(NavItem, {
                    classList: ".col",
                    mdl,
                    href: "/login",
                    link: "Login",
                    classList: `${isActiveRoute("/login")} button para`,
                  }),

                  m(NavItem, {
                    classList: ".col",
                    mdl,
                    href: "/register",
                    link: "Register",
                    classList: `${isActiveRoute("/register")} button para`,
                  }),
                ]),

            //create route accordian
            routes(mdl).map((r) =>
              r.children.any()
                ? m(NavSection, {
                    mdl,
                    route: r,
                    toggleRoutes,
                    isSelected: mdl.navState[r.id],
                  })
                : m(
                    ".grid",
                    m(NavItem, {
                      mdl,
                      href: r.route,
                      link: r.name,
                      classList: `.col ${isActiveRoute(r.route)}`,
                    })
                  )
            ),
          ])
        )
      ),
  }
}

export default NavModal
