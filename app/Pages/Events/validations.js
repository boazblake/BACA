import { curryN, identity, lensProp, mergeAll } from "ramda"
import { Success } from "data.validation"
import { validate, isRequired } from "Utils"

const ValidateEvent = Success(curryN(3, identity))

const titleLens = lensProp("title")
const detailsLens = lensProp("description")
const locationLens = lensProp("location")

const validateTitle = (data) =>
  Success(data).apLeft(
    validate(isRequired, titleLens, "Your event needs a title.", data)
  )

const validateDescription = (data) =>
  Success(data).apLeft(
    validate(
      isRequired,
      detailsLens,
      "Your event needs some information.",
      data
    )
  )

const validateLocation = (data) =>
  Success(data).apLeft(
    validate(isRequired, locationLens, "Your event needs a location.", data)
  )

export const validateEventTask = (data) => {
  console.log(data)
  return ValidateEvent.ap(validateTitle(data))
    .ap(validateDescription(data))
    .ap(validateLocation(data))
    .failureMap(mergeAll)
    .toTask()
}
