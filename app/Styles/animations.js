export const SlideInUp = ({ dom }) => dom.classList.toggle("slideInUp")
export const SlideInLeft = ({ dom }) => dom.classList.toggle("slideInLeft")
export const SlideInRight = ({ dom }) => dom.classList.toggle("slideInRight")
export const AddToCart = ({ dom }) => dom.classList.toggle("slide-out-tr")

export const AddToCartOut = ({ dom }) => {
  AddToCart({ dom })
  return new Promise(function (resolve) {
    setTimeout(() => {
      resolve()
    }, 500)
  })
}

export const SlideOutRight = ({ dom }) => {
  dom.classList.replace("slideInLeft", "slideOutLeft")
  return new Promise(function (resolve) {
    setTimeout(() => {
      resolve()
    }, 300)
  })
}

export const SlideOutLeft = ({ dom }) => {
  dom.classList.replace("slideInRight", "slideOutRight")
  return new Promise(function (resolve) {
    setTimeout(() => {
      resolve()
    }, 300)
  })
}

export const SlideDown = ({ dom }) => {
  dom.style.opacity = 0
  dom.classList.toggle("slideInDown")
  dom.style.opacity = 1
}

export const SlideUp = ({ dom }) => {
  dom.classList.replace("slideInDown", "slideOutUp")
  return new Promise(function (resolve) {
    setTimeout(() => {
      resolve()
    }, 300)
  })
}

export const SlideChildrenInRight = ({ dom }) => {
  let children = [...dom.children]

  return children.map((child, idx) => {
    child.style.opacity = 0
    setTimeout(() => {
      child.classList.toggle("slideInLeft")
      child.style.opacity = 1
    }, (idx + 1) * 10)
  })
}

export const StretchInLeft = (idx) => ({ dom }) => {
  dom.style.opacity = 0
  return setTimeout(() => {
    dom.classList.toggle("stretchRight")
    dom.style.opacity = 1
  }, idx * 100 + 20)
}

export const SlideChildrenInDown = (idx) => ({ dom }) => {
  dom.style.opacity = 0
  setTimeout(() => {
    dom.classList.toggle("slideDown")
    dom.style.opacity = 1
  }, (idx + 1) * 200)
}

export const animate = (dir) => ({ dom }) => {
  dom.style.opacity = 0
  setTimeout(() => {
    dom.classList.toggle(dir)
    dom.style.opacity = 1
  }, 200)
}

export const RemoveChildrenOut = ({ dom }) =>
  new Promise(() => {
    ;[...dom.children].reverse().map((child, idx) => {
      return setTimeout(() => {
        child.style.display = "none"
      }, idx * 100)
    })
  })
