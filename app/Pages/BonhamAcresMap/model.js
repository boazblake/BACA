import Task from "data.task"
import { compose, path, prop, map } from "ramda"
import { isAdminOrMod } from "@/Utils/helpers"
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
L.Icon.Default.imagePath = 'images/leaflet-images/';
const PopUp = L.popup()

// export const defaultPushPinEntities = (mdl) => [
//   toPushPin({
//     property: "BACA",
//     // lat: Microsoft.Maps.Location.parseLatLong(mdl.Map.bh).latitude,
//     // lng: Microsoft.Maps.Location.parseLatLong(mdl.Map.bh).longitude,
//   }).getLocation(),
// ]

// export const getCenterView = (locations) =>
//   Microsoft.Maps.LocationRect.fromLocations(locations)

export const setCenterView = (state) => (bounds) =>
  state.map.setView({ bounds, minZoom: 16 })

export const loadMapConfig = (mdl) => (state) => {
  const getCenterViewFromStateEntities = () => {
    let locations = state.entities//.map((e) => e.getLocation())
    // return getCenterView(locations)
    return locations
  }

  // let centerPoint = getCenterViewFromStateEntities()

  // let lat = centerPoint.center.latitude
  // let lng = centerPoint.center.longitude

  state.opts.center = mdl.Map.bh.split(',') //[lat, lng]//new Microsoft.Maps.Location(lat, lng)
  const [lat, lng] = state.opts.center
  // make map
  var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  });
  const stamen = new L.StamenTileLayer("watercolor");

  const markers = L.layerGroup(state.entities.map(e => L.marker([e.lat, e.lng, {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
  }])))

  // console.log('markers', markers)



  state.map = L.map('map', {
    layers: [
      osm, stamen, markers
    ],
    zoom: 5,
  }).setView(state.opts.center, state.opts.zoom)

  state.map.attributionControl.setPrefix(false)

  state.map.on('mapReady', map => {
    console.log('map', map)
    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  })

  state.map.on('click', (e) => {
    popup
      .setLatLng(e.latlng)
      .setContent("You clicked the map at " + e.latlng.toString())
      .openOn(state.map);


  })
  return state
}

const toPin = (lat, lng, opts) => ({ lat, lng, opts })
// new Microsoft.Maps.Pushpin(
//   {
//     altitude: 0,
//     altitudeReference: -1,
//     latitude: lat,
//     longitude: lng,
//   },
//   {
//     ...opts,
//     color: "purple",
//   }
// )

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

export const selectLocation = (
  mdl,
  state,
  { formatted, geometry: { lat, lng } }
) => {
  state.newLocation = { property: formatted, lat, lng }
  let pin = toPushPin(state.newLocation)

  state.findLocationResults = []
  state.entities.push(pin)
  state.map.entities.push(pin)
  setCenterView(state)(
    getCenterView(state.entities.map((e) => e.getLocation()))
  )
}

// const addEventHandlers = (mdl, state) => (pin) => {
//   const pinClicked = (pin, e) => {
//     state.entities.map((e) => e.setOptions({ color: "purple" }))

//     if (isAdminOrMod(mdl)) {
//       //only admins
//       pin.setOptions({
//         // enableHoverStyle: true,
//         // enableClickedStyle: true,
//         color: "green",
//         draggable: true,
//       })

//       state.newLocation = {
//         property: pin.metadata.title,
//         lat: pin.geometry.y,
//         lng: pin.geometry.x,
//       }

//       // Microsoft.Maps.Events.addHandler(pin, "dragend", (e) => {
//       //   state.newLocation.lng = pin.geometry.x
//       //   state.newLocation.lat = pin.geometry.y
//       // })
//     } else {
//       //regular user
//       pin.setOptions({ color: "green" })
//     }

//     //all users
//     state.infobox.setOptions({
//       location: e.target.getLocation(),
//       title: e.target.metadata.title,
//       visible: true,
//     })
//     m.redraw()
//   }
//   // //Add mouse events to the pin.
//   // Microsoft.Maps.Events.addHandler(pin, "click", (e) => pinClicked(pin, e))

//   return pin
// }

export const formatLocationToPushPin = ([property, { lat, lng }]) =>
  toPushPin({ property, lat, lng })

const updateModelDate = (mdl) => (addresses) => {
  mdl.data.addresses = addresses
  return addresses
}

export const loadResidentsTask = (mdl, state) =>
  mdl.http.back4App
    .getTask(mdl)("geo/addresses")
    .map(prop("results"))
    // .map(log('?'))
    .map(updateModelDate(mdl))
    // .map(map(toPushPin))
    // .map(map(addEventHandlers(mdl, state)))
    .map(updateStateEntities(state))

export const findLocationTask = (mdl, query) =>
  mdl.http.openCageTask(mdl)(query)
    .map(log('?'))
// .map(paths([["formatted"], ["geometry"]]))
// .chain((xs) => (xs.includes(undefined) ? Task.rejected() : Task.of(xs)))

const addAddressTask = (mdl, location) =>
  mdl.http.back4App
    .postTask(mdl)("geo/addresses")(location)
    .map(prop("results"))

const updateAddressTask = (mdl, location, id) =>
  mdl.http.back4App
    .putTask(mdl)(`geo/addresses/${id}`)(location)
    .map(prop("results"))

export const saveResidentTask = (mdl, location) => {
  let currentAddress = mdl.data.addresses.find(
    (l) => l.property == location.property
  )

  return currentAddress
    ? updateAddressTask(mdl, location, currentAddress.objectId)
    : addAddressTask(mdl, location)
}

