const BoardMembers = [
  {
    title: "President",
    name: "Tim Hatton",
    phones: ["713-480-8020", "713-208-8756"],
    emails: ["timhatton202@yahoo.com", "kimyhatton@gmail.com"],
  },
  {
    title: "Vice President",
    name: "",
    phones: [],
    emails: [],
  },
  {
    title: "Secretary",
    name: "Alan Hernandez",
    phones: ["832-798-2568"],
    emails: ["Alan@teamwpr.com"],
  },
  {
    title: "Treasurer",
    name: "David Gessing",
    phones: ["281-733-8959"],
    emails: ["Dgessing@gmail.com"],
  },
  {
    title: "Deed Restrictions ",
    name: "Henrietta Nixon",
    phones: ["713-773-9291"],
    emails: ["nixkh@comcast.net"],
  },
]

const calcSize = (mdl) => {
  switch (mdl.settings.screenSize) {
    case "phone":
      return "12"
    case "wide":
      return "12"
    case "tablet":
      return "6"
    default:
    case "desktop":
      return "4"
  }
}

const Contact = (mdl) => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "article",
        m(
          "section.container",
          m(
            "h2.is-center.is-marginless.m-b-15.strong",
            "Bonham Acres Civic Association Board Members April 13, 2021"
          ),
          m(
            ".row.container",
            BoardMembers.map(({ title, name, phones, emails }) =>
              m(
                `.card.col-${calcSize(mdl)}`,
                m("h4.text-primary", title),
                m("p", name),
                phones.map((phone) => m("p", phone)),
                emails.map((email) =>
                  m("p.pointer.underline", { href: `mailto:${email}` }, email)
                )
              )
            )
          )
        )
      ),
  }
}

export default Contact

