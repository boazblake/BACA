import Task from "data.task"
import { prop } from "ramda"

const toAccountVM = (mdl) => (accnts) => {
  mdl.user.accounts = accnts
  return mdl
  // let cart = mergeCarts(accnts[0].cart)(mdl.cart)
  // mdl.user.account = { objectId: accnts[0].objectId, cart }
  // mdl.user.address = accnts[0].address
  // mdl.cart = cart
  // setUserToken(mdl)(mdl.user)
  // return cart
}

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

const getUserAccountTask = (mdl) => (_) => {
  let userAccount = encodeURI(`where={"userId":"${mdl.user.objectId}"}`)
  return mdl.http.back4App
    .getTask(mdl)(`classes/Accounts?${userAccount}`)
    .map(prop("results"))
    .chain((account) =>
      account.any() ? Task.of(account) : createAccountTask(mdl)
    )
    .map(toAccountVM(mdl))
}

export const loginTask =
  (mdl) =>
  ({ email, password }) =>
    loginUserTask(mdl)({ email, password }).chain(getUserAccountTask(mdl))

export const registerUserTask =
  (mdl) =>
  ({ name, email, password, isAdmin }) =>
    mdl.http.back4App.postTask(mdl)("users")({
      username: email,
      name,
      email,
      password: btoa(password),
      isAdmin,
    })

export const createAccountTask = (mdl) => {
  mdl.user.account = {
    address: {},
  }
  return mdl.http.back4App
    .postTask(mdl)("classes/Accounts")({
      userId: mdl.user.objectId,
      address: {},
    })
    .map(({ objectId }) => {
      mdl.user.account.objectId = objectId
      return mdl
    })
}
