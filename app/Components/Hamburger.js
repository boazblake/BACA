import m from "mithril"
import { menuIcon } from '@/Utils/'

const Hamburger = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      mdl.state.showNavModal() ||
      m('a.button.primary.outline', {
        onclick: () => mdl.state.showNavModal(!mdl.state.showNavModal()),
      }, 'Menu')
  }
}

export default Hamburger
