import { log } from "Utils"
import {
  head,
  toPairs,
  compose,
  map,
  prop,
  filter,
  identity,
  keys,
} from "ramda"
import { Table } from "Components/table.js"

const nav = (role) => {
  return [role == "admin" && "users", "blogs", "events", "images"]
}

const state = {
  tab: "blogs",
}

const toColCell = (x) => ({ col: x[0], val: x[1] })

const userViewmodel = (x) => {
  delete x.ACL
  // delete x.updatedAt
  // delete x.createdAt
  // delete x.isAdmin
  console.log("x", x)
  return x
}

const eventsViewmodel = identity
const blogsViewmodel = identity
const imagesViewmodel = identity

const displayType = {
  users: userViewmodel,
  events: eventsViewmodel,
  blogs: blogsViewmodel,
  images: imagesViewmodel,
}

const handleType = (tab) => (data) => displayType[tab](data)

const toViewmodel = (state, mdl) => {
  let data = mdl.data[state.tab].map(handleType(state.tab))
  let cols = Array.from(new Set(data.flatMap(keys)))
  let rows = compose(map(map(toColCell)), map(toPairs))(data)
  return { cols, rows }
}

const getUsers = (mdl) =>
  mdl.http.back4App
    .getTask(mdl)("Users")
    .map(prop("results"))
    .map(filter(prop("name")))
    .fork(log("error"), (u) => (mdl.data.users = u))

const Dashboard = ({ attrs: { mdl } }) => {
  console.log(mdl.data[state.tab])
  return {
    oninit: ({ attrs: { mdl } }) => mdl.user.role == "admin" && getUsers(mdl),
    view: ({ attrs: { mdl } }) =>
      m(
        "section",
        m(
          "nav.tabs",
          nav(mdl.user.role).map((tab) =>
            m(
              "a.tab.pointer",
              {
                class: state.tab == tab ? "active" : "",
                onclick: () => (state.tab = tab),
              },
              tab.toUpperCase()
            )
          )
        ),

        m("section.container", m(Table, { mdl, ...toViewmodel(state, mdl) }))
      ),
  }
}

export default Dashboard
