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
import Task from "data.task"
import { head, map, prop, tail } from "ramda"

const showNavMenu = (mdl) =>
  mdl.settings.screenSize !== "desktop" && mdl.state.showNavModal()

const vertAlign = (mdl) => {
  return !mdl.Routes.find((r) => mdl.state.navState() == r.id).children.any()
    ? "is-vertical-align"
    : ""
}

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

const fetchAll = ({ attrs: { mdl } }) => {
  const onError = (e) => console.error(e)
  const onSuccess = ({ events, images, blogs }) => {
    mdl.data.events = events
    mdl.data.images = images
    mdl.data.blogs = blogs
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
      { "data-theme": "light", id: "layout", role: "main" },
      m(Toolbar, { mdl }),
      m(Hero, { mdl }),
      mdl.settings.screenSize == "desktop" &&
        m(
          "nav.navigation",
          {
            class: vertAlign(mdl),
          },
          m(Navbar, { mdl }),
          m(SubNavbar, { mdl })
        ),

      m(Main, { mdl, children }),
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
