import NavLink from "Components/nav-link.js"
import { isActiveRoute } from "Utils/index.js"

const AuthBox = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      mdl.state.isAuth()
        ? m(
            ".grouped",
            mdl.user.isAdmin &&
              m(NavLink, {
                mdl,
                href: `/dashboard/${mdl.user.name}`,
                link: "Dashboard",
                classList: `${isActiveRoute(
                  `/dashboard/${mdl.user.name}`
                )} outline`,
              }),
            m(NavLink, {
              mdl,
              href: `/account/${mdl.user.name}`,
              role: "button",
              link: "Your Account",
              classList: `${isActiveRoute(
                `/account/${mdl.user.name}`
              )} outline`,
            }),
            m(NavLink, {
              mdl,
              href: "/logout",
              role: "button",
              link: "Logout",
              classList: "secondary",
            })
          )
        : m(
            ".grouped",
            m(NavLink, {
              mdl,
              role: "button",
              href: "/login",
              link: "Login",
              classList: `${isActiveRoute("/login")} outline`,
            }),
            m(NavLink, {
              mdl,
              role: "button",
              href: "/register",
              link: "Register",
              classList: `${isActiveRoute("/register")} outline secondary`,
            })
          ),
  }
}

export default AuthBox
