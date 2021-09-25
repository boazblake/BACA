const Profile = () => {
  return {
    view: ({ attrs: { mdl, data } }) => {
      console.log(data)
      return m(
        "form",
        m("figure", m("img.avatar", { src: data.avatar })),
        !data.emailVerified && m("label.warning", "email not verified"),
        m("label", "name", m("input", { value: data.name })),
        m("label", "email", m("input", { value: data.email })),
        m("label", "street", m("input", { value: data.street })),
        m("label", "city", m("input", { value: data.city })),
        m("label", "state", m("input", { value: data.state })),
        m("label", "zip", m("input", { value: data.zip })),
        m("button", "Update")
      )
    },
  }
}

export default Profile
