import m from "mithril"
import { menuIcon, xIcon } from '@/Utils'


const Hamburger = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "span.pointer is-center",
        {
          onclick: () => mdl.state.showNavModal(!mdl.state.showNavModal()),
          style: {
            ...(mdl.state.isAuth() &&
              mdl.settings.screenSize == "phone" && { margin: "0" }),
            fontSize: '5rem',
            color: 'green'
          },
        },
        mdl.state.showNavModal()
          ? xIcon
          : menuIcon
      ),
  }
}

export default Hamburger
