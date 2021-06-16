import { AngleLine, PopOutLine } from "@mithril-icons/clarity"
import NavLink from "Components/nav-link"
import AuthBox from "Components/authbox"
import { isActiveRoute } from "Utils/index.js"
import { replaceCSS } from "Styles/animations.js"

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
          isSelected() &&
            m(
              `.grid.col-align-bottom show-child-routes`,
              {
                onbeforeremove: replaceCSS(
                  "show-child-routes",
                  "hide-child-routes"
                ),
              },
              childRoutes.map((r) =>
                r.group.includes("external")
                  ? m(
                      "li.nav-link",
                      m(
                        "a",
                        { target: "_blank", href: r.external },
                        r.name,
                        m(PopOutLine, {
                          margin: "8px",
                          width: "15px",
                          height: "15px",
                        })
                      )
                    )
                  : m(NavItem, {
                      mdl,
                      href: r.route,
                      link: r.name,
                      classList: `p-8 grid-between ${isActiveRoute(r.route)}`,
                    })
              )
            )
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
            m(AuthBox, { mdl }),
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
