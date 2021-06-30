const About = (mdl) => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "section.pad-y-6",
        { class: mdl.settings.screenSize == "desktop" && "pad-50" },

        m(
          "section.is-marginless.bd-primary.pad-x-50.pad-y-6.bg-light",
          m(
            "hgroup.grid",
            m("h2", "About Us."),
            m(
              ".row",
              m(
                "p.col",
                "The Bonham Acres Civic Association (BACA) is a registered 501(c)4 organization that was established to work for the common good of the community, providing a single voice for our neighborhood to area municipalities. The BACA operates with an all-volunteer staff, voluntary membership dues, and the donated time and energy of its neighbors."
              ),
              m("figure.col", m("img", { src: "images/IMG_3216.webp" }))
            )
          )
        ),
        m(
          "section.is-marginless.bd-primary.pad-x-50.pad-y-6.bg-primary.text-white",
          m(
            "hgroup.grid",

            m("h2", "The Area."),
            m(
              ".row",
              m(
                "figure.col",
                m("img", {
                  src: "images/baca-map.webp",
                })
              ),
              m(
                "p.col",
                "Bonham Acres: Small jewell of a neighborhood located in Southwest Houston. Subdivision bounded by Bissonnet to the north, Braes Bayou to the south, Fondren to the east and Bonhomme Re to the west. There are 5 streets within, Bonhomme Rd, Cadawac Rd, Lugary Ln, Wanda Ln and Tree Frog. Bonham Acres Houston neighborhood is located in 77074 zip code in Harris county. Bonham Acres has 152 single family properties with a median build year of 1958 and a median size of 1,807 Sqft."
              )
            )
          )
        ),
        m(
          "section.is-marginless.bd-primary.pad-x-50.pad-y-6.bg-light",

          m("h2", "Community Support."),

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
