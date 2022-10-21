import Routes from "../Routes/index.js"
import http from "@/Utils/http"
import Stream from "mithril-stream"
import Settings from './settings.js'
const data = {
  events: [],
  images: [],
  blogs: [],
  addresses: [],
  accounts: [],
  dues: [],
  messages: [],
}

const Map = {
  locale: Stream(null),
  bh: [29.681078, -95.512912],
  bounds: [-125.5957, 24.36711, -65.39063, 48.944],
}

const state = {
  paginate: {
    page: Stream(1),
    total_pages: Stream(0),
    total_results: Stream(0),
  },
  query: Stream(""),
  isLoading: Stream(false),
  loadingProgress: {
    max: Stream(null),
    value: Stream(null),
  },
  dragging: {},
  locationPreAuth: Stream('/'),
  locationPreEvent: Stream('/'),
  isAuth: Stream(false),
  showAuthModal: Stream(false),
  showNavModal: Stream(false),
  showNavMenu: Stream(false),
  showLayoutModal: Stream(false),
  navState: Stream("/"),
  subnavState: Stream(""),
  showingSubnav: Stream(false),
  navSelected: Stream(""),
  image: Stream(0),
  fab: Stream(0),
  editBlog: Stream(false),
  selectedPreviewEvent: Stream(null),
  distanceFromTop: Stream(0),
  anchor: undefined,
  hasNotifications: Stream(false),
}
const user = {
  role: "user",
}

const errors = {}

const Model = {
  Map,
  http,
  Routes,
  state,
  user,
  data,
  errors,
  settings: Settings,
  paypal: {},
  modal: {
    header: Stream([]),
    content: Stream([]),
    classList: Stream([]),
    footer: Stream([]),
  },
  toggleLayoutModal: (mdl) => {
    mdl.state.showLayoutModal(!mdl.state.showLayoutModal());
    if (!mdl.state.showLayoutModal()) {
      mdl.modal.header([])
      mdl.modal.content([])
      mdl.modal.footer([])
      mdl.modal.classList([])
    }
  },
  toggleUserModal: (mdl) => mdl.state.showUserModal(!mdl.state.showUserModal()),
  toggleAuthModal: (mdl) => mdl.state.showAuthModal(!mdl.state.showAuthModal()),
  toggleNavModal: (mdl) => mdl.state.showNavModal(!mdl.state.showNavModal()),
}

export default Model

