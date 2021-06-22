import NavLink from "Components/nav-link.js"
import { isActiveRoute } from "Utils/index.js"

const AuthBox = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      mdl.state.isAuth()
        ? m("ul", [
            mdl.user.isAdmin &&
              m(
                "li",
                m(NavLink, {
                  mdl,
                  href: `/dashboard/${mdl.user.name}`,
                  link: "Dashboard",
                  classList: `${isActiveRoute(`/dashboard/${mdl.user.name}`)}`,
                })
              ),
            m(
              "li",
              m(NavLink, {
                mdl,
                href: `/account/${mdl.user.name}`,
                link: "Your Account",
                classList: `${isActiveRoute(`/account/${mdl.user.name}`)}`,
              })
            ),
            m(
              "li",
              m(NavLink, {
                mdl,
                href: "/logout",
                link: "Logout",
                classList: "bold  ",
              })
            ),
          ])
        : m("ul", [
            m(
              "li",
              m(NavLink, {
                mdl,
                href: "/login",
                link: "Login",
                classList: `${isActiveRoute("/login")}`,
              })
            ),

            m(
              "li",
              m(NavLink, {
                mdl,
                href: "/register",
                link: "Register",
                classList: `${isActiveRoute("/register")}`,
              })
            ),
          ]),
  }
}

export default AuthBox
