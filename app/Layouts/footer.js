import NavLink from "Components/nav-link.js"
import { isActiveRoute } from "Utils/index.js"

const Footer = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m("footer.footer", m("h1.is-center", "Bonham Acres Civic Association")),
  }
}

export default Footer
