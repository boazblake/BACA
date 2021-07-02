const Footer = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "footer.footer.grid.card",
        m(
          "section.row",
          m(
            ".col-6",
            m("h3", "Useful Links"),
            m(
              "ul",
              m(
                "a.row.underline.nav-link",
                {
                  target: "__blank",
                  href: "https://www.bonhamacres.org/city-ordinances",
                },
                "City of Houston City Ordinances"
              ),
              m(
                "a.row.underline.nav-link",
                {
                  target: "__blank",
                  href: "https://09ee40f4-9ff7-4e3d-819c-429f2403854d.filesusr.com/ugd/537320_f8abdef644b04cde8dc36f671bb9868f.pdf",
                },
                "COH trash facts"
              ),
              m(
                "a.row.underline.nav-link",
                {
                  target: "__blank",
                  href: "https://www.houstontx.gov/solidwaste/Recycle_Cal.pdf",
                },
                "COH recycling calendar Schedule B"
              ),
              m(
                "a.row.underline.nav-link",
                {
                  target: "__blank",
                  href: "https://mycity.maps.arcgis.com/apps/webappviewer/index.html?id=63ed96f439fe404387c9f9e479dc4965",
                },
                "COH trash service day"
              ),
              m(
                "a.row.underline.nav-link",
                {
                  target: "__blank",
                  href: "http://www.houstontx.gov/solidwaste/treewaste.html",
                },
                "COH tree and junk waste program"
              ),
              m(
                "a.row.underline.nav-link",
                {
                  target: "__blank",
                  href: "http://www.centerpointenergy.com/en-us/residential/customer-service/electric-outage-center/report-streetlight-outages?sa=ho",
                },
                "Streetlight outage repair"
              ),
              m(
                "a.row.underline.nav-link",
                { target: "__blank", href: "http://www.hcad.org/" },
                "Harris County Appraisal District"
              ),
              m(
                "a.row.underline.nav-link",
                { target: "__blank", href: "http://www.hcfcd.org/" },
                "Harris County Flood Control District"
              ),
              m(
                "a.row.underline.nav-link",
                {
                  target: "__blank",
                  href: "https://09ee40f4-9ff7-4e3d-819c-429f2403854d.filesusr.com/ugd/537320_2472d77b27c640bfa348613b3aa86c95.pdf",
                },
                "Construction in a Floodplain"
              )
            )
          ),
          m(
            ".col-6",
            m("h1.is-center", "Connect with Bonham Acres via"),
            m(
              ".grouped",
              m(
                "a.row.underline.nav-link",
                {
                  target: "__blank",
                  href: "https://www.facebook.com/groups/BonhamAcres?modal=false&should_open_composer=false&hoisted_section_header_type=notifications&show_migration_preparation_dialog=false&show_migration_onboarding_dialog=false",
                },
                m("img", {
                  style: { width: "50px", height: "50px" },
                  src: "icons/facebook.png",
                })
              ),
              m(
                "a.row.underline.nav-link",
                {
                  target: "__blank",
                  href: "https://nextdoor.com/neighborhood/bonhamacres--houston--tx/",
                },
                m("img", {
                  style: { width: "50px", height: "50px" },
                  src: "icons/nextdoor.png",
                })
              ),
              m(
                "a.row.underline.nav-link",
                {
                  target: "__blank",
                  href: "http://mailto:bonhamacrescivicassociation@gmail.com/",
                },
                m("img", {
                  style: { width: "50px", height: "50px" },
                  src: "icons/gmail.png",
                })
              )
            )
          )
        )
      ),
  }
}

export default Footer
