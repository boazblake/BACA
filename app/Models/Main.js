import Routes from "../Routes/index.js"
import http from "Utils/http"

const data = {
  events: [],
  images: [],
  blogs: [],
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
  navState: Stream("/home"),
  subnavState: Stream(""),
  image: Stream(0),
  fab: Stream(0),
  editBlog: Stream(false),
  showAuthModal: Stream(false),
  selectedPreviewEvent: Stream(null),
}
const user = {
  isAdmin: false,
}
const settings = {}

const errors = {}

const Model = {
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
