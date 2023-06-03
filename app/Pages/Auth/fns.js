import { prop } from 'ramda'

//ASs3FDsWTORwsfyCIoG4DSgm0ReuA2jQpU9A_2u9F-LMhSl0i3H3na6iJ6GS_tuHefm4y4-EY2JCAKAN
const addPayPal = () => {
  window.paypal = null
  const script = document.createElement('script')
  script.src = "https://www.paypal.com/sdk/js?client-id=AYWuxgG1kAOvtI3sK-KwMgust3Xq7HtrHJqvfyoQNRM2RC7CJPNcCZb4EkrY5wr-u31bbHax1lAMpicK&components=buttons&enable-funding=venmo,paylater&currency=USD"
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





