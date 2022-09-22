import { prop } from 'ramda'

export const setUserAndSessionToken = (mdl) => ({ account, dues, user }) => {
  sessionStorage.setItem("baca-user", JSON.stringify(user.objectId))
  sessionStorage.setItem("baca-session-token", user["sessionToken"])
  mdl.state.isAuth(true)
  mdl.user = user
  mdl.dues = dues
  mdl.account = account
  mdl.user.routename = mdl.user.name.replaceAll(" ", "")
  console.log(mdl)
  return mdl
}

export const loginTask =
  (mdl) =>
    ({ email, password }) =>
      mdl.http.back4App
        .postTask(mdl)(`auth/login`)({ email, password })
        .map(prop('results'))
        .map(setUserAndSessionToken(mdl))


export const resetPasswordTask = (mdl, email) =>
  mdl.http.back4App.postTask(mdl)("requestPasswordReset")({ email })

export const registerUserTask =
  (mdl) =>
    ({ name, email, password, role }) =>
      mdl.http.back4App.postTask(mdl)("auth/register")({
        username: email,
        name,
        email,
        password,
        role,
      })





