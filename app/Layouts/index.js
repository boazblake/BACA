import Hero from "./hero.js"
import Navbar from "./navbar.js"
import SubNavbar from "./subnavbar.js"
import Main from "./main.js"
import Footer from "./footer.js"
import NavModal from "./nav-modal.js"
import { SlideOutRight, SlideInLeft } from "Styles/animations.js"
import Toolbar from "./toolbar.js"
import Login from "Pages/Auth/login-user.js"
import Register from "Pages/Auth/register-user.js"
import Loader from "Components/loader"
import Task from "data.task"
import { head, map, prop, tail } from "ramda"

const state = {
  status: "loading",
  navDom: null,
}

const updateNavigationStyle = (dom, showNav) => {
  let hide = { position: "unset", top: 0 }
  let show = { position: "sticky", top: "65px" }
  if (dom) {
    return showNav
      ? (dom.classList.add("fadeOut"), hide)
      : (dom.classList.remove("fadeOut"), show)
  } else {
    return showNav ? hide : show
  }
}

const showNavMenu = (mdl) =>
  mdl.settings.screenSize !== "desktop" && mdl.state.showNavModal()

const vertAlign = (mdl) => {
  return !mdl.Routes.find((r) => mdl.state.navState() == r.id).children.any()
    ? "is-vertical-align"
    : ""
}

const onBodyScroll =
  (mdl) =>
  ({ target: { scrollTop } }) => {
    mdl.state.distanceFromTop(scrollTop)
    if (scrollTop >= 300) {
      mdl.state.showNavMenu(true)
      m.redraw()
    } else {
      mdl.state.showNavMenu(false)
      m.redraw()
    }
  }
const onLayout =
  (mdl) =>
  ({ dom }) =>
    mdl.settings.screenSize == "desktop" &&
    dom.parentNode.addEventListener("scroll", onBodyScroll(mdl))

const toEventViewModel = (event) => {
  let start = event.start.split("T")
  return {
    image: event.image,
    startDate: head(start),
    startTime: tail(start),
    title: event.title,
    allDay: event.allDay,
    objectId: event.objectId,
  }
}

const fetchTask = (mdl) => (url) => mdl.http.back4App.getTask(mdl)(url)

export const fetchAll = ({ attrs: { mdl } }) => {
  const onError = (e) => {
    log("fetchAll - layout - error")(e)
    e.code == 504 && fetchAll({ attrs: { mdl } })
    state.status = "error"
  }
  const onSuccess = ({ events, images, blogs }) => {
    mdl.data.events = events
    mdl.data.images = images
    mdl.data.blogs = blogs
    state.status = "loaded"
  }

  Task.of((events) => (images) => (blogs) => ({ events, images, blogs }))
    .ap(
      fetchTask(mdl)("Classes/Events")
        .map(prop("results"))
        .map(map(toEventViewModel))
    )
    .ap(fetchTask(mdl)("Classes/Gallery").map(prop("results")))
    .ap(fetchTask(mdl)("Classes/Blogs").map(prop("results")))
    .fork(onError, onSuccess)
}

const Layout = {
  oninit: fetchAll,
  view: ({ children, attrs: { mdl } }) =>
    m(
      "#layout",
      {
        oncreate: onLayout(mdl),
        "data-theme": "light",
        id: "layout",
        role: "main",
      },
      m(Toolbar, { mdl }),
      mdl.settings.screenSize == "desktop" &&
        m(
          `nav#navigation.animated`,
          {
            oncreate: ({ dom }) => (state.navDom = dom),
            style: updateNavigationStyle(state.navDom, mdl.state.showNavMenu()),
            class: vertAlign(mdl),
          },
          m(Navbar, { mdl }),
          m(SubNavbar, { mdl })
        ),
      m(Hero, { mdl }),
      state.status == "error" && m("p", "ERROR"),
      state.status == "loading" && m(Loader),
      state.status == "loaded" &&
        m("section.animated.zoomIn", m(Main, { mdl, children })),
      showNavMenu(mdl) &&
        m(NavModal, {
          oncreate: SlideInLeft,
          onbeforeremove: SlideOutRight,
          mdl,
        }),
      mdl.state.showAuthModal() == "login" && m(Login, { mdl }),
      mdl.state.showAuthModal() == "register" && m(Register, { mdl }),
      m(Footer, { mdl })
    ),
}

export default Layout
