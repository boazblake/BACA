import m from "mithril"
import { vertEllipIcon } from '@/Utils/'

const Hamburger = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      mdl.state.showNavModal() ||
      m('a.button.primary.outline', {
        onclick: () => mdl.state.showNavModal(!mdl.state.showNavModal()),
      }, mdl.settings.screenSize == 'phone' ? vertEllipIcon : 'Menu')
  }
}

export default Hamburger
