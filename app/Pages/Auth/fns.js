import Task from "data.task"
import { head, prop } from "ramda"

const setUserAndSessionToken = (mdl) => (user) => {
  sessionStorage.setItem("baca-user", JSON.stringify(user.objectId))
  sessionStorage.setItem("baca-session-token", user["sessionToken"])
  mdl.state.isAuth(true)
  mdl.user = user
  return mdl
}

export const loginUserTask =
  (mdl) =>
  ({ email, password }) => {
    let login = encodeURI(`username=${email}&password=${btoa(password)}`)
    return mdl.http.back4App
      .getTask(mdl)(`login?${login}`)
      .map(setUserAndSessionToken(mdl))
  }

const getUserAccountTask = (mdl) => (encodeId) =>
  mdl.http.back4App
    .getTask(mdl)(`classes/Accounts?${encodeId}`)
    .map(prop("results"))
    .chain((account) =>
      account.any() ? Task.of(account) : createAccountTask(mdl)
    )
    .map(head)

const getUserDuesTask = (mdl) => (encodeId) =>
  mdl.http.back4App
    .getTask(mdl)(`classes/Dues?${encodeId}`)
    .map(prop("results"))
    .chain((dues) => (dues.any() ? Task.of(dues) : createDuesTask(mdl)))

const getUserMessagesTask = (mdl) => (encodeId) =>
  mdl.http.back4App
    .getTask(mdl)(`classes/Messages?${encodeId}`)
    .map(prop("results"))
    .chain((messages) =>
      messages.any() ? Task.of(messages) : createMessagesTask(mdl)
    )

const getUserInfoTask = (mdl) => {
  let encodeId = encodeURI(`where={"userId":"${mdl.user.objectId}"}`)
  return Task.of((account) =>
    // (dues) => (messages) =>
    {
      mdl.data.account = account
      // mdl.data.dues = dues
      // mdl.data.messages = messages
    }
  ).ap(getUserAccountTask(mdl)(encodeId))
  // .ap(getUserDuesTask(mdl)(encodeId))
  // .ap(getUserMessagesTask(mdl)(encodeId))
}
export const loginTask =
  (mdl) =>
  ({ email, password }) =>
    loginUserTask(mdl)({ email, password }).chain((_) => getUserInfoTask(mdl))

export const resetPasswordTask = (mdl, email) =>
  mdl.http.back4App.getTask(mdl)("requestPasswordReset", { email })

export const registerUserTask =
  (mdl) =>
  ({ name, email, password, role }) =>
    mdl.http.back4App.postTask(mdl)("users")({
      username: email,
      name,
      email,
      password: btoa(password),
      role,
    })

export const createAccountTask = (mdl) => {
  mdl.user.account = {
    address: "",
    avatar: "",
  }
  return mdl.http.back4App
    .postTask(mdl)("classes/Accounts")({
      userId: mdl.user.objectId,
      avatar: "",
      address: "",
    })
    .map(({ objectId }) => {
      mdl.user.account.objectId = objectId
      return mdl
    })
}

export const createDuesTask = (mdl) => {
  mdl.user.dues = {}
  return mdl.http.back4App
    .postTask(mdl)("classes/Dues")({
      userId: mdl.user.objectId,
      address: "",
    })
    .map(({ objectId }) => {
      mdl.user.dues.objectId = objectId
      return mdl
    })
}

export const createMessagesTask = (mdl) => {
  mdl.user.conversations = {}
  return mdl.http.back4App
    .postTask(mdl)("classes/Conversations")({
      userId: mdl.user.objectId,
    })
    .map(({ objectId }) => {
      mdl.user.conversations.objectId = objectId
      return mdl
    })
}
