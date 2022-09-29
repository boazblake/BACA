import m from "mithril"
import Hero from "./hero.js"
import Navbar from "./navbar.js"
import SubNavbar from "./subnavbar.js"
import Main from "./main.js"
import Footer from "./footer.js"
import Modal from "@/Components/modal"
import NavModal from "./nav-modal.js"
import { SlideOutRight, SlideInLeft } from "@/Styles/animations.js"
import Toolbar from "./toolbar.js"
import Loader from "@/Components/loader"
import Task from "data.task"
import { head, map, prop, tail, uniqWith, eqBy } from "ramda"
import { state as blogState, Modal as BlogTitlePicModal } from '@/Pages/Blog/blog-editor'
import {
  state as albumState, AddImagesModal
} from '@/Pages/Gallery/album.js'
import {
  state as galleryState, NewAlbumModal
} from '@/Pages/Gallery/gallery.js'
import {
  state as eventState,
  submitEvent,
  deleteEvent,
  resetState,
  uploadImage,
} from "@/Pages/Events/index.js"
import Editor from "@/Pages/Events/editor.js"
import Event from "@/Pages/Events/event.js"

const state = {
  status: "loading",
  navDom: null,
  errors: {}
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
  return !mdl.Routes.find((r) => mdl.state.navState() == r.id)?.children.any()
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
  let end = event.end.split("T")
  return {
    start: event.start,
    end: event.end,
    image: event.image,
    startDate: head(start),
    startTime: tail(start),
    endDate: head(end),
    endTime: tail(end),
    title: event.title,
    allDay: event.allDay,
    objectId: event.objectId,
  }
}

const fetchTask = (mdl, url) => mdl.http.back4App.getTask(mdl)(url).map(prop('results'))

export const fetchAll = ({ attrs: { mdl } }) => {
  const onError = (e) => {
    state.errors = e
    state.status = "error"
    log("fetchAll - layout - error")(e)
    if (!e) return m.route.set('/logout')
    if (e.code == 209) return m.route.set('/logout')
  }
  const onSuccess = ({ events, images, blogs }) => {
    mdl.data.events = events
    mdl.data.images = images
    mdl.data.blogs = blogs
    state.status = "loaded"
  }

  Task.of((events) => (images) => (blogs) => ({ events, images, blogs }))
    .ap(fetchTask(mdl, "events").map(map(toEventViewModel)))
    .ap(fetchTask(mdl, "gallery").map(uniqWith(eqBy(prop("thumb")))))
    .ap(fetchTask(mdl, "blogs")).map(log('??'))
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
          // class: vertAlign(mdl),
        },
        m(Navbar, { mdl }),
        m(SubNavbar, { mdl })
      ),
      m(Hero, { mdl }),
      state.status == "error" && m("p", "ERROR", state?.errors?.error),
      state.status == "loading" && m(Loader),
      state.status == "loaded" && m("section", m(Main, { mdl, children })),
      showNavMenu(mdl) &&
      m(NavModal, {
        oncreate: SlideInLeft,
        onbeforeremove: SlideOutRight,
        mdl,
      }),
      mdl.state.showLayoutModal() && m(Modal, { mdl }),
      eventState.showEditor() &&
      m(Editor, {
        mdl,
        state: eventState,
        showEditor: eventState.showEditor,
        submitEvent,
        deleteEvent,
        resetState,
        uploadImage: uploadImage(mdl),
      }),
      eventState.previewEvent() &&
      m(Event, {
        mdl,
        state: eventState,
        editEvent: eventState.showEditor,
        previewEvent: eventState.previewEvent,
        event: eventState.event,
        resetState,
      }),

      galleryState.showModal() && m(NewAlbumModal, { mdl }),
      albumState.addImagesModal() && m(AddImagesModal, { mdl }),
      blogState.showModal() && m(BlogTitlePicModal, { mdl }),


      m(Footer, { mdl })
    ),
}

export default Layout

