import NavLink from "Components/nav-link.js"
import { isActiveRoute } from "Utils/index.js"

const Footer = () => {
  return {
    view: ({ attrs: { mdl } }) => m("footer.containe-fluid", "footer"),
  }
}

export default Footer
