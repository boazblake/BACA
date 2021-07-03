import ViolationReport from "Components/report"
import { ExclamationTriangleLine } from "@mithril-icons/clarity"

const state = {
  showOrdinanceViolation: Stream(false),
}

const CityOrd = (mdl) => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "section.bd-light",
        { class: mdl.settings.screenSize == "desktop" && "p-50" },
        m(
          "section.is-marginless.bd-primary.p-x-50.p-y-6.bg-primary.text-white",
          m(
            "p",
            "Bonham Acres is a deed restricted community in which deed restrictions are actively enforced. ",
            m(
              m.route.Link,
              {
                selector: "a.underline",
                class: "text-white",
                href: "/legal/deed-restrictions",
              },
              m("em", "The Deed Restrictions")
            ),
            " are intended to preserve and enhance property values as well as to promote safety in our community. "
          ),
          m(
            "p",
            "Many of these deed restrictions are enforced with the assistance of the City of Houston, whose legal department and our council representative have supported and whom have been valuable partners to Bonham Acres when enforcing deed restrictions."
          ),
          m(
            "p",
            "Violations to any of these deed restrictions should be reported directly to the Bonham Acres Civic Association.",
            m(
              ".p-y-6.is-center",
              m(
                "button.button.icon.bd-error",
                { onclick: (e) => state.showOrdinanceViolation(true) },
                "Report City Ordinance Violation",
                m(ExclamationTriangleLine, { fill: "red" })
              ),
              state.showOrdinanceViolation() && m(ViolationReport, { mdl })
            ),
            m(
              "p",
              m(
                "em",
                "All reports will be treated as anonymous and your name kept private."
              )
            ),
            m(
              "p.strong",
              "Your assistance in reporting violations will go a very long way to protect and enhance our property values."
            )
          )
        ),
        m(
          "section.is-marginless.bd-primary.p-x-50.p-y-6.bg-light",
          m(
            "hgroup",
            m("h2", "Car Parking in Residential Area"),
            m(
              "em",
              "Parking of Vehicles on Residential Property Chapter 28, Article X"
            ),
            m(
              "p",
              "To read the complete ordinance, go to ",
              m(
                "a.nav-link",
                { target: "__blank", href: "www.Municode.com" },
                "www.Municode.com"
              ),
              " on the internet and search for City of Houston, Chapter 28, Article X, or enter Parking of Vehicles on Residential Property in the search block."
            ),
            m(
              "p",
              m(
                "a.nav-link",
                {
                  target: "__blank",
                  href: "https://www.houstontx.gov/police/pdfs/brochures/english/Parking_of_vehicles_on_residential_propert.pdf",
                },
                "https://www.houstontx.gov/police/pdfs/brochures/english/Parking_of_vehicles_on_residential_propert.pdf"
              )
            ),

            m(
              "p",
              "You can find out if a residence is covered by the ordinance by calling 311 or going to the city map viewer on the internet at ",
              m(
                "a.nav-link",
                {
                  target: "__blank",
                  href: "http://mycity.houstontx.gov/public/",
                },
                " http://mycity.houstontx.gov/public/ "
              ),
              "and activating ",
              m("em", "the Prohibited Yard Parking application: ")
            ),
            m(
              "p",
              m(
                "a.nav-link",
                {
                  target: "__blank",
                  href: "https://www.houstontx.gov/planning/Prohibited-Yard-Parking-Ordinance.html",
                },
                "https://www.houstontx.gov/planning/Prohibited-Yard-Parking-Ordinance.html"
              )
            )
          )
        ),
        m(
          "section.is-marginless.bd-primary.p-x-50.p-y-6.bg-light",
          m(
            "hgroup",
            m("h2", "Nuisance Ordinances"),
            m(
              "p",
              m(
                "a.nav-link",
                {
                  target: "__blank",
                  href: "https://statutes.capitol.texas.gov/Docs/HS/htm/HS.342.htm#342.004",
                },
                "Section 342.004 of the Texas Health and Safety Code"
              )
            ),
            m(
              "p",
              "State law giving authority to municipalities to require landowners to keep their property free of weeds, brush and conditions constituting a public nuisance."
            ),
            m(
              "p",
              m(
                "a.nav-link",
                {
                  target: "__blank",
                  href: "https://statutes.capitol.texas.gov/Docs/TN/htm/TN.311.htm#311.003",
                },
                "Sections 311.003 - 311.004 of the Texas Transportation Code"
              )
            ),

            m(
              "p",
              "State laws giving authority to type-A municipalities to require a person to keep the front of their premise free of weeds and trash. It also gives them the authority to require a landowner to improve their sidewalk and allows home-rule municipalities to declare a defective sidewalk a public nuisance."
            ),
            m(
              "p",
              m(
                "a.nav-link",
                {
                  target: "__blank",
                  href: "https://statutes.capitol.texas.gov/Docs/TN/htm/TN.683.htm#E",
                },
                "Texas Transportation Code, Chapter 683, Subchapter E"
              )
            ),
            m(
              "p",
              "State law governing junked vehicles; declaring them a public nuisance."
            )
          )
        ),

        m(
          "section.is-marginless.bd-primary.p-x-50.p-y-6.bg-light",
          m(
            "hgroup",
            m("h2", "Noise Ordinances"),

            m(
              "p",
              "According to the ",
              ("a.nav-link",
              { target: "__blank", href: "#" },
              " Houston Sound Ordinance, "),
              " sound ",
              m("span.strong", " cannot exceed 65 decibels during the day "),
              "and",
              m("span.strong", " 58 decibels at night in residential areas."),
              " Permits must be obtained for sound up to 75 decibels until 10pm on Sundays through Thursdays and until 11pm on Fridays and Saturdays. ",
              " The Houston ordinance penalizes up to ",
              m("span.strong", " $1, 000 per offense or per hour.")
            ),

            m(
              "p",
              "Noise or Barking dogs contact information: The LAPD suggests that noise complaints, from loud TVs to awful parties, are best dealt with by your local police station. Call them at (877) ASK-LAPD (275-5273). Do not call 911. If your neighbor complaint is more of the barking dog variety, try the city's Animal Care and Control Department."
            ),

            m(
              "p",
              m(
                "a.nav-link",
                {
                  target: "__blank",
                  href: "https://library.municode.com/tx/houston/codes/code_of_ordinances?nodeId=COOR_CH30NOSOLERE",
                },
                "https://library.municode.com/tx/houston/codes/code_of_ordinances?nodeId=COOR_CH30NOSOLERE"
              )
            )
          )
        ),

        m(
          "section.is-marginless.bd-primary.p-x-50.p-y-6.bg-light",
          m(
            "hgroup",
            m("h2", "Trash & Dumpster Ordinances"),
            m(
              "p",
              m(
                "a.nav-link",
                {
                  target: "__blank",
                  href: "https://www.houstontx.gov/solidwaste/trashfacts.pdf",
                },
                "https://www.houstontx.gov/solidwaste/trashfacts.pdf"
              )
            )
          )
        )
      ),
  }
}

export default CityOrd
