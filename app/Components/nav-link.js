const handlers = (types, fn) =>
  types.reduce((acc, type) => Object.assign(acc, { [type]: fn }), {})

const showBorderStyle = (style) => {
  style.border = "1px solid black"
  return style
}

const hideBorderStyle = (style) => {
  style.border = ""
  return style
}

export const NavLink = () => {
  return {
    view: ({ attrs: { mdl, href, link, classList, ...rest } }) => {
      return m(
        m.route.Link,
        {
          onclick: (e) => e.stopPropagation(),
          style: {
            ...handlers(["onmouseover", "onmouseout"], (e) => {
              return e.type == "mouseover"
                ? showBorderStyle(e.target.style)
                : hideBorderStyle(e.target.style)
            }),
          },
          href,
          class: `nav-link ${classList} ${
            mdl.state.navSelected() == link ? "is-active" : ""
          }`,
          ...rest,
        },
        link
      )
    },
  }
}

export default NavLink
