import Profile from "./profile"
import Dues from "./dues"
import Messages from "./messages"
import { loadAllTask } from "./model"

const nav = () => ["profile", "dues", "messages"]

const state = {
  tab: "profile",
  status: "loading",
}

const loadAll = (mdl) => {
  const onSuccess = ({ profile, dues, messages }) => {
    mdl.data.profile = profile
    mdl.data.dues = dues
    mdl.data.messages = messages
    state.status = "success"
  }
  const onError = (e) => {
    state.status = "error"
    console.error("issues w fetching data", e)
  }

  loadAllTask(mdl).fork(onError, onSuccess)
}

const Account = () => {
  return {
    //future add param to quick nav the state.tab to messages pane.
    oninit: ({ attrs: { mdl } }) => loadAll(mdl),
    view: ({ attrs: { mdl } }) =>
      m(
        "section",
        state.status == "error" && m("ERROR"),
        state.status == "loading" && m("loading"),
        state.status == "success" &&
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
            m(
              "section.container",
              state.tab == "profile" && m(Profile, { mdl }),
              state.tab == "dues" && m(Dues, { mdl, reload: loadAll }),
              state.tab == "messages" && m(Messages, { mdl })
            )
          )
      ),
  }
}

export default Account
