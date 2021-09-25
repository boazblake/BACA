import { log } from "Utils"
import { prop, filter } from "ramda"
import { Table, formatDataForTable } from "Components/table.js"
import { EditLine } from "@mithril-icons/clarity/cjs"
import { RemoveLine } from "@mithril-icons/clarity"

const nav = (role) => {
  let tabs = ["blogs", "events", "images"]
  if (role == "admin") tabs.push("users")
  return tabs
}

const state = {
  tab: "blogs",
}

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
  action: [
    m(EditLine, { onclick: () => console.log("edit", objectId) }),
    m(RemoveLine, { onclick: () => console.log(objectId, "delete") }),
  ],
})

const eventsViewmodel = ({ objectId, title, image, startDate, startTime }) => ({
  title,
  image: m("img", { src: image }),
  startDate,
  startTime,
  action: [
    m(EditLine, { onclick: () => console.log("edit", objectId) }),
    m(RemoveLine, { onclick: () => console.log(objectId, "delete") }),
  ],
})

const blogsViewmodel = ({ objectId, title, img, text, author }) => ({
  title,
  img: m("img", { style: { maxWidth: "150px" }, src: img }),
  text: text.slice(0, 300),
  author,
  action: [
    m(EditLine, { onclick: () => console.log("edit", objectId) }),
    m(RemoveLine, { onclick: () => console.log(objectId, "delete") }),
  ],
})

const imagesViewmodel = ({ objectId, album, image }) => ({
  album,
  image: m("img", { style: { maxWidth: "150px" }, src: image }),
  action: [
    m(EditLine, { onclick: () => console.log("edit", objectId) }),
    m(RemoveLine, { onclick: () => console.log(objectId, "delete") }),
  ],
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
  return formatDataForTable(data)
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
