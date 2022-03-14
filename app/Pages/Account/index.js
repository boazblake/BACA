import Profile from "./profile"
import Dues from "./dues"
import Messages from "./messages"
import { loadAllTask } from "./model"

const Account = ({ attrs: { mdl } }) => {
  const nav = () => ["PROFILE", "DUES", "MESSAGES"]

  const state = {
    tab: mdl.state?.anchor ?? "PROFILE",
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

    mdl.state.anchor
      ? (state.status = "success")
      : loadAllTask(mdl).fork(onError, onSuccess)
  }

  return {
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
                  m.route.Link,
                  {
                    class:
                      state.tab == tab ? "active tab.pointer" : "tab.pointer",
                    href: `/account/${mdl.user.routename}/#${tab}`,
                  },
                  tab.toUpperCase()
                )
              )
            ),
            m(
              "section.container",
              state.tab == "PROFILE" && m(Profile, { mdl }),
              state.tab == "DUES" && m(Dues, { mdl, reload: loadAll }),
              state.tab == "MESSAGES" && m(Messages, { mdl })
            )
          )
      ),
  }
}

export default Account
