import { toPairs, compose, map, prop, filter, keys, head } from "ramda"
import { EditLine } from "@mithril-icons/clarity/cjs"
import { RemoveLine } from "@mithril-icons/clarity/cjs"
import Task from "data.task"

const toProfileVM =
  ({ emailVerified, email, name }) =>
  ({ objectId, avatar, address }) => ({
    objectId,
    address,
    emailVerified,
    email,
    name,
    avatar,
  })

const getProfile = (mdl) => (id) =>
  mdl.http.back4App
    .getTask(mdl)(`classes/Accounts?${id}`)
    .map(prop("results"))
    .map(head)
    .map(toProfileVM(mdl.user))

const toDuesVM = (dues) => dues

const getDues = (mdl) => (id) =>
  mdl.http.back4App
    .getTask(mdl)(`classes/Dues?${id}`)
    .map(prop("results"))
    .map(map(toDuesVM))

const toMessagesVM = (dues) => dues

const getMessages = (mdl) => (id) =>
  mdl.http.back4App
    .getTask(mdl)(`classes/Messages?${id}`)
    .map(prop("results"))
    .map(map(toMessagesVM))

export const loadAllTask = (mdl) => {
  let id = encodeURI(`where={"userId":"${mdl.user.objectId}"}`)
  return Task.of((profile) => (dues) => (messages) => ({
    profile,
    dues,
    messages,
  }))
    .ap(getProfile(mdl)(id))
    .ap(getDues(mdl)(id))
    .ap(getMessages(mdl)(id))
}
