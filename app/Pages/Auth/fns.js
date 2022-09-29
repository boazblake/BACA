import { prop } from 'ramda'


const addPayPal = () => {
  window.paypal = null
  const script = document.createElement('script')
  script.src = "https://www.paypal.com/sdk/js?client-id=sb&enable-funding=venmo&currency=USD"
  script.id = 'paypal'
  script.async = true
  script.defer = true
  script['data-sdk-integration-source'] = 'button-factory'
  const head = document.head
  head.insertBefore(script, head.firstChild)
}

export const setUserAndSessionToken = (mdl) => ({ account, dues, user }) => {
  sessionStorage.setItem("baca-user", JSON.stringify(user.objectId))
  sessionStorage.setItem("baca-session-token", user["sessionToken"])
  addPayPal()
  mdl.state.isAuth(true)
  mdl.user = user
  mdl.dues = dues
  mdl.account = account
  mdl.user.routename = mdl.user.name.replaceAll(" ", "")
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
  mdl.http.back4App.postTask(mdl)("auth/reset")({ email })

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





