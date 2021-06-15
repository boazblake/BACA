import Header from "./Header/index.js"
import Body from "./Body/index.js"
import Footer from "./footer.js"

const Layout = () => {
  return {
    view: ({ children, attrs: { mdl } }) =>
      m(
        ".layout",
        { id: "layout", role: "main" },
        m(Header, { mdl }),
        m(Body, { mdl, children }),
        m(Footer, { mdl })
      ),
  }
}

export default Layout
