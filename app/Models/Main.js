import Routes from "../Routes/index.js"
import http from "Utils/http"

const data = {
  events: [],
  images: [],
  blogs: [],
}

const Map = {
  locale: Stream(null),
  bounds: Stream(encodeURIComponent("-125.5957, 24.36711, -65.39063, 48.944")),
  defaultBounds: encodeURIComponent("-125.5957, 24.36711, -65.39063, 48.944"),
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
  isAuth: Stream(false),
  navSelected: Stream(""),
  showNavModal: Stream(false),
  navState: Stream("/"),
  subnavState: Stream(""),
  image: Stream(0),
  fab: Stream(0),
  editBlog: Stream(false),
  showAuthModal: Stream(false),
  selectedPreviewEvent: Stream(null),
}
const user = {
  role: "user",
}
const settings = {}

const errors = {}

const Model = {
  Map,
  http,
  Routes,
  state,
  user,
  data,
  errors,
  settings,
  paypal: {},
  toggleUserModal: (mdl) => mdl.state.showUserModal(!mdl.state.showUserModal()),
  toggleAuthModal: (mdl) => mdl.state.showAuthModal(!mdl.state.showAuthModal()),
  toggleNavModal: (mdl) => mdl.state.showNavModal(!mdl.state.showNavModal()),
}

export default Model
