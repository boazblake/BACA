import m from "mithril"
const About = (mdl) => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "section",
        m("section",
          m('.container', m(
            "hgroup.grid",
            m("h2.strong", "About Us"),
            m(
              ".row",
              m(
                ".col",
                m('p', 'The Bonham Acres Civic Association (BACA) is a registered 501(c)4 organization that was established to work for the common good of the community, providing a single voice for our neighborhood to area municipalities.'),
                m('p', " The BACA operates with an all-volunteer staff, voluntary membership dues, and the donated time and energy of its neighbors."),
              ),
              m(
                "figure.col",
                m("img.height-auto", { src: "images/IMG_3216.webp" })
              )
            )
          ))
        ),
        m(
          "section.bg-primary.text-white",
          m('.container', m(
            "hgroup.grid",
            m("h2.strong", "Bonham Acres Sub Division"),
            m(
              ".row",
              m(
                "figure.col-12.col-6-md",
                m("img.height-auto", {
                  src: "images/baca-map.webp",
                })
              ),
              m(
                ".col",
                m('p', 'A small jewell of a neighborhood located in Southwest Houston.'),
                m('p', 'The subdivision is bounded by Bissonnet to the north, Braes Bayou to the south, Fondren to th,east and Bonhomme Rd to the west.'),
                m('p', 'There are 5 streets within, Bonhomme Rd, Cadawac Rd, Lugary Ln, Wanda Ln and Tree Frog.'),
                m('p', 'Bonham Acres Houston neighborhood is located in 77074 zip code in Harris county.'),
                m('p', 'Bonham Acres has 152 single family properties with a median build year of 1958 and a media,size of 1,807 Sqft.'),

              )
            )
          ))
        ),
        m(
          "section.is-marginless.p-x-50.p-y-6",

          m("h2.strong", "Community Support"),

          m(
            ".grid",
            m(
              ".row",
              m(
                ".col-3",
                m(
                  "hgroup",
                  m("p.strong", "Historical Accounts"),
                  m("p", "Dr. Bonham’s home became Bonham Family Nature Park.")
                )
              ),
              m(
                ".col-3",
                m(
                  "hgroup",
                  m("p.strong", "Improvements"),
                  m(
                    "p",
                    "Streets lights paid for by residents of Bonham Acres."
                  )
                )
              ),
              m(
                ".col-3",
                m(
                  "hgroup",
                  m("p.strong", "Working Together"),
                  m(
                    "p",
                    "Residents worked together to get speed bumps installed."
                  )
                )
              ),
              m(
                ".col-3",
                m(
                  "hgroup",
                  m("p.strong", "Legacy of Impact"),
                  m(
                    "p",
                    "Residents funded the 5 entry monuments into Bonham Acres."
                  )
                )
              )
            )
          )
        )
      ),
  }
}

export default About

