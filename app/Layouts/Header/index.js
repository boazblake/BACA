import NavBar from "./navbar.js"

const Header = ({ attrs: { mdl } }) => {
  return {
    view: ({ attrs: { mdl } }) => m(".header", m(NavBar, { mdl })),
  }
}

export default Header
