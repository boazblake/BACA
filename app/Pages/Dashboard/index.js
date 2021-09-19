import { log } from "Utils"
import { toPairs, compose, map, prop, filter, keys } from "ramda"
import { Table } from "Components/table.js"
import { EditLine } from "@mithril-icons/clarity/cjs"

const nav = (role) => {
  let tabs = ["blogs", "events", "images"]
  if (role == "admin") tabs.push("users")
  return tabs
}

const state = {
  tab: "blogs",
}

const toColCell = (x) => ({ col: x[0], val: x[1] })

const userViewmodel = ({
  objectId,
  email,
  emailVerified,
  name,
  role,
  username,
}) => ({
  name,
  username,
  email,
  emailVerified,
  role,
  action: m(EditLine, { onclick: () => console.log(objectId) }),
})

const eventsViewmodel = ({ objectId, title, image, startDate, startTime }) => ({
  title,
  image,
  startDate,
  startTime,
  action: m(EditLine, { onclick: () => console.log(objectId) }),
})

const blogsViewmodel = ({ objectId, title, img, text, author }) => ({
  title,
  img,
  text,
  author,
  action: m(EditLine, { onclick: () => console.log(objectId) }),
})

const imagesViewmodel = ({ objectId, album, image }) => ({
  album,
  image,
  action: m(EditLine, { onclick: () => console.log(objectId) }),
})

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

const Dashboard = () => {
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
