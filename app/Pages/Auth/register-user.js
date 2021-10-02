import NavLink from "Components/nav-link"
import { jsonCopy } from "Utils"
import { validateUserRegistrationTask } from "./Validations"
import { registerUserTask, createAccountTask } from "./fns.js"
// import LogoLoader from "Components/LogoLoader"

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
  state.data.userModel = jsonCopy(dataModel)
  state.errors = {}
  state.httpError = undefined
  state.isSubmitted = false
  state.showErrorMsg(false)
  state.errorMsg("")
}

export const validateForm = (mdl) => (data) => {
  const onError = (errs) => {
    if (errs) {
      state.errors = errs
      state.errorMsg(errs.error)
      state.showErrorMsg(errs.error)
      console.log("failed - state", JSON.stringify(state))
    } else {
      state.errorMsg(
        "There seems to be an ssue with logging in. Have you registered?"
      )
      state.showErrorMsg(true)
      console.log("failed - state", state)
    }
  }

  const onSuccess = (mdl) => {
    state.errors = {}
    // sessionStorage.setItem("baca-session-token", mdl.user["sessionToken"])
    // sessionStorage.setItem("baca-user", JSON.stringify(mdl.user.objectId))
    state.errorMsg(
      "Successfully registered - please check the email you used to register with for the verification link. After you have verified you may login."
    )
    state.showErrorMsg(true)
  }
  // return console.log(data)
  state.isSubmitted = true
  validateUserRegistrationTask(data)
    .chain(registerUserTask(mdl))
    // .chain(createAccountTask)
    .fork(onError, onSuccess)
}

export const Register = () => {
  return {
    onremove: () => resetState(),
    view: ({ attrs: { mdl } }) =>
      m(
        "section.container.p-y-50",
        state.showErrorMsg() && m("code.warning", state.errorMsg()),
        m(
          "article.card",
          mdl.settings.screenSize != "phone" && {
            style: { maxWidth: "60%", margin: "0 auto" },
          },

          m(
            "form",
            {
              role: "form",
              id: "register-form",
              onsubmit: (e) => e.preventDefault(),
            },

            m("input", {
              class: state.isSubmitted
                ? state.errors.name
                  ? "error"
                  : "success"
                : "",
              id: "reg-name",
              type: "text",
              placeholder: "Full Name",
              onkeyup: (e) => (state.data.userModel.name = e.target.value),
              value: state.data.userModel.name,
            }),
            state.errors.name && m("code.error", state.errors.name),

            m(
              "form-group",
              { class: mdl.settings.screenSize == "desktop" && "grouped" },
              m("input", {
                class: state.isSubmitted
                  ? state.errors.email
                    ? "error"
                    : "success"
                  : "",
                id: "reg-email",
                type: "email",
                placeholder: "Email",
                onkeyup: (e) => (state.data.userModel.email = e.target.value),
                value: state.data.userModel.email,
              }),
              state.errors.email && m("code.error", state.errors.email),

              m("input", {
                id: "confirmEmail",
                class: state.isSubmitted
                  ? state.errors.confirmEmail
                    ? "error"
                    : "success"
                  : "",
                type: "email",
                placeholder: "Confirm Email",
                onkeyup: (e) =>
                  (state.data.userModel.confirmEmail = e.target.value),
                value: state.data.userModel.confirmEmail,
              })
            ),
            state.errors.confirmEmail &&
              m("code.error", state.errors.confirmEmail),

            m(
              "form-group",
              { class: mdl.settings.screenSize == "desktop" && "grouped" },
              m("input", {
                class: state.isSubmitted
                  ? state.errors.password
                    ? "error"
                    : "success"
                  : "",
                id: "reg-pass",
                type: "password",
                placeholder: "Password",
                onkeyup: (e) =>
                  (state.data.userModel.password = e.target.value),
                value: state.data.userModel.password,
              }),
              state.errors.password && m("code.error", state.errors.password),

              m("input", {
                class: state.isSubmitted
                  ? state.errors.confirmPassword
                    ? "error"
                    : "success"
                  : "",
                id: "pass-confirm",
                type: "password",
                placeholder: "Confirm Password",
                onkeyup: (e) =>
                  (state.data.userModel.confirmPassword = e.target.value),
                value: state.data.userModel.confirmPassword,
              })
            ),
            state.errors.confirmPassword &&
              m("code.error", state.errors.confirmPassword),

            m(
              "button.button.primary",
              {
                form: `register-form`,
                onclick: () => validateForm(mdl)(state.data.userModel),
                class: mdl.state.isLoading() && "loading",
              },
              "Register"
            )
          )
        ),
        m(
          ".auth-link",
          "Need to ",
          m(NavLink, {
            mdl,
            href: "/login",
            link: "Login",
            classList: "",
          }),
          " ?"
        ),
        state.httpError && m(".toast toast-error", state.httpError)
      ),
  }
}

export default Register
