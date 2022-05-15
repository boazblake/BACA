import Task from "data.task"
import { compose, path, prop, map } from "ramda"

export const defaultPushPinEntities = (mdl) => [
  toPushPin({
    property: "BACA",
    lat: Microsoft.Maps.Location.parseLatLong(mdl.Map.bh).latitude,
    lng: Microsoft.Maps.Location.parseLatLong(mdl.Map.bh).longitude,
  }).getLocation(),
]

export const getCenterView = (locations) =>
  Microsoft.Maps.LocationRect.fromLocations(locations)

export const setCenterView = (state) => (bounds) =>
  state.map.setView({ bounds, minZoom: 16 })

export const loadMapConfig = (mdl) => (state) => {
  const getCenterViewFromStateEntities = () => {
    let locations = state.entities.map((e) => e.getLocation())
    return getCenterView(locations)
  }

  let centerPoint = getCenterViewFromStateEntities()

  let lat = centerPoint.center.latitude
  let lng = centerPoint.center.longitude

  state.opts.center = new Microsoft.Maps.Location(lat, lng)

  // make map
  state.map = new Microsoft.Maps.Map(state.dom, state.opts)
  state.map.entities.push(state.entities)
  setCenterView(state)(centerPoint)

  console.log(state.map.entities[0])
  // Info box
  state.infobox = new Microsoft.Maps.Infobox(state.entities[0], {
    visible: false,
    autoAlignment: true,
  })
  state.infobox.setMap(state.map)

  return state
}

const toPin = (lat, lng, opts) =>
  new Microsoft.Maps.Pushpin(
    {
      altitude: 0,
      altitudeReference: -1,
      latitude: lat,
      longitude: lng,
    },
    {
      ...opts,
    }
  )

const addMetaData = (title) => (pin) => {
  pin.metadata = { title }
  return pin
}

export const toPushPin = ({ property, lat, lng }, opts) =>
  compose(addMetaData(property), toPin)(lat, lng, opts)

const updateStateEntities = (state) => (entities) => {
  if (entities.any()) {
    state.entities = entities
  }
  return state
}

const addEventHandlers = (mdl, state) => (pin) => {
  const pinClicked = (pin, e) => {
    console.log("pin clicked", pin, e.target.metadata.title)
    pin.setOptions({ enableHoverStyle: true, enableClickedStyle: true })

    state.infobox.setOptions({
      location: e.target.getLocation(),
      title: e.target.metadata.title,
      visible: true,
    })
    // //Highlight the mouse event div to indicate that the event has fired.
    // dom.style.backgroundColor = "LightGreen"

    // //Remove the highlighting after a second.
    setTimeout(function () {
      // dom.style.background = "white"
    }, 1000)
  }
  // //Add mouse events to the pin.
  Microsoft.Maps.Events.addHandler(pin, "click", (e) => pinClicked(pin, e))
  // Microsoft.Maps.Events.addHandler(pin, "mousedown", function () {
  //   console.log(pin)
  //   highlight("pushpinMousedown")
  // })
  // Microsoft.Maps.Events.addHandler(pin, "mouseout", function () {
  //   console.log(pin)
  //   highlight("pushpinMouseout")
  // })
  // Microsoft.Maps.Events.addHandler(pin, "mouseover", function () {
  //   console.log(pin)
  //   highlight("pushpinMouseover")
  // })
  // Microsoft.Maps.Events.addHandler(pin, "mouseup", function () {
  //   console.log(pin)
  //   highlight("pushpinMouseup")
  // })

  return pin
}

export const formatLocationToPushPin = ([property, { lat, lng }]) =>
  toPushPin({ property, lat, lng })

export const loadResidentsTask = (mdl, state) =>
  mdl.http.back4App
    .getTask(mdl)("classes/Addresses?limit=1000")
    .map(prop("results"))
    .map(map(toPushPin))
    .map(map(addEventHandlers(mdl, state)))
    .map(updateStateEntities(state))

export const findLocationTask = (mdl, query) =>
  mdl.http.openCage
    .getLocationTask(mdl)(query)
    .map(path(["results"]))
// .map(paths([["formatted"], ["geometry"]]))
// .chain((xs) => (xs.includes(undefined) ? Task.rejected() : Task.of(xs)))

export const saveResidentTask = (mdl, location) =>
  mdl.http.back4App
    .postTask(mdl)("classes/Addresses")(location)
    .map(prop("results"))

