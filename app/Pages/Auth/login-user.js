import NavLink from "Components/nav-link"
import { jsonCopy } from "Utils"
import { validateLoginTask } from "./Validations.js"
import { loginTask } from "./fns.js"
import { GroupSolidBadged } from "@mithril-icons/clarity/cjs"
// import LogoLoader from "Components/LogoLoader"

const validateForm = (mdl) => (data) => {
  const onError = (errs) => {
    if (errs.code != 209) {
      state.errors = errs
      state.errorMsg(errs.error)
      state.showErrorMsg(errs.error)
      console.log("failed - state", JSON.stringify(state))
    } else {
      state.errorMsg(
        "There seems to be an issue with logging in. Have you registered or verified your email?"
      )
      state.showErrorMsg(true)
      console.log("failed - other?", state)
    }
  }

  const onSuccess = (mdl) => (_) => {
    state.errors = {}
    m.route.set("/")
  }

  state.isSubmitted = true

  validateLoginTask(data.userModel)
    .chain(loginTask(mdl))
    .fork(onError, onSuccess(mdl))
}

const userModel = {
  name: "",
  email: "",
  password: "",
  confirmEmail: "",
  confirmPassword: "",
  role: "user",
}

const dataModel = { userModel }

const state = {
  isSubmitted: false,
  errors: {},
  httpError: undefined,
  data: jsonCopy(dataModel),
  showErrorMsg: Stream(false),
  errorMsg: Stream(""),
}

const resetState = () => {
  state.data = jsonCopy(dataModel)
  state.errors = {}
  state.httpError = undefined
  state.isSubmitted = false
  state.showErrorMsg(false)
  state.errorMsg("")
}

export const Login = () => {
  return {
    onremove: () => resetState(),
    view: ({ attrs: { mdl } }) =>
      mdl.state.isLoading()
        ? "" //m(LogoLoader, { mdl })
        : m(
            "section.container.p-y-50",

            state.showErrorMsg() && m("p.text-error", state.errorMsg()),
            m(
              "article.card",
              mdl.settings.screenSize != "phone" && {
                style: { maxWidth: "80%", margin: "0 auto" },
              },
              m(
                "form.row",
                {
                  role: "form",
                  id: "login-form",
                  onsubmit: (e) => e.preventDefault(),
                },
                m(
                  "formgroup.col-12",
                  // {
                  //   class: mdl.settings.screenSize == "desktop" && "grouped",
                  // },
                  m("input", {
                    class: state.isSubmitted
                      ? state.errors.email
                        ? "error"
                        : "success"
                      : "",
                    id: "reg-email",
                    type: "email",
                    placeholder: "Email",
                    onkeyup: (e) => {
                      // state.isSubmitted && validateForm(mdl)(state.data)
                      state.data.userModel.email = e.target.value
                    },
                    value: state.data.userModel.email,
                  }),
                  state.errors.email && m("p.text-error", state.errors.email)
                ),
                m(
                  "formgroup.col-12",
                  m("input", {
                    class: state.isSubmitted
                      ? state.errors.password
                        ? "error"
                        : "success"
                      : "",
                    id: "reg-pass",
                    type: "password",
                    placeholder: "Password",
                    onkeyup: (e) => {
                      // state.isSubmitted && validateForm(mdl)(state.data)
                      state.data.userModel.password = e.target.value
                    },
                    value: state.data.userModel.password,
                  }),
                  state.errors.password &&
                    m("p.text-error", state.errors.password)
                )
              ),
              m(
                "button.button.primary.is-center",
                {
                  role: "button",
                  form: `login-form`,
                  onclick: () => validateForm(mdl)(state.data),
                  class: mdl.state.isLoading() && "loading",
                },
                "LOGIN"
              ),

              state.httpError && m(".toast toast-error", state.httpError)
            ),
            m(
              ".auth-link",
              "Need to ",
              m(
                "u",
                m(NavLink, {
                  mdl,
                  href: "/register",
                  link: "register",
                  classList: "",
                })
              ),
              " ?"
            )
          ),
  }
}

export default Login
