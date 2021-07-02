import { saveStorageTask } from "Utils"
import { mergeDeepWith, add, prop } from "ramda"

const mergeCarts = (accnt) => (cart) => mergeDeepWith(add, cart, accnt)

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

const setUserToken = (mdl) => (user) => {
  sessionStorage.setItem("baca-user", JSON.stringify(user))
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
      .map(setUserToken(mdl))
  }

const getUserAccountTask = (mdl) => (_) => {
  let userAccount = encodeURI(`where={"userId":"${mdl.user.objectId}"}`)
  return mdl.http.back4App
    .getTask(mdl)(`classes/Accounts?${userAccount}`)
    .map(prop("results"))
    .map(toAccountVM(mdl))
}

export const loginTask =
  (mdl) =>
  ({ email, password }) =>
    loginUserTask(mdl)({ email, password }).chain(getUserAccountTask(mdl))

export const registerUserTask =
  (mdl) =>
  ({ name, email, password, isAdmin }) =>
    mdl.http.back4App
      .postTask(mdl)("users")({
        username: email,
        name,
        email,
        password: btoa(password),
        isAdmin,
      })
      .map((user) =>
        setUserToken(mdl)({ name, email, password, isAdmin, ...user })
      )

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
