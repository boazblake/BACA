const BoardMembers = [
  {
    title: "President",
    name: "Tim Hatton",
    phones: ["713-480-8020", "713-208-8756"],
    emails: ["timhatton202@yahoo.com", "kimyhatton@gmail.com"],
  },
  {
    title: "Vice President",
    name: "Cortney Meza",
    phones: ["832-491-9705"],
    emails: ["mezacort@yahoo.com"],
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

const Contact = (mdl) => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "section.container.grid.bd-light",
        m("h2", "Bonham Acres Civic Association Board Members April 13, 2021"),
        m(
          "article.row",
          BoardMembers.map(({ title, name, phones, emails }) =>
            m(
              ".card.col-4",
              m("h4", title),
              m("p", name),
              phones.map((phone) => m("p", phone)),
              emails.map((email) =>
                m("p.pointer.underline", { href: `mailto:${email}` }, email)
              )
            )
          )
        )
      ),
  }
}

export default Contact
