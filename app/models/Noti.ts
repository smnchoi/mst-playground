import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

export interface NotiModelType {
  id: number
  title: string
  content: string
  createdAt: Date
}

/**
 * Model description here for TypeScript hints.
 */
export const NotiModel = types
  .model("Noti")
  .props({
    id: types.identifierNumber,
    title: types.string,
    content: types.string,
    createdAt: types.Date,
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Noti extends Instance<typeof NotiModel> {}
export interface NotiSnapshotOut extends SnapshotOut<typeof NotiModel> {}
export interface NotiSnapshotIn extends SnapshotIn<typeof NotiModel> {}
export const createNotiDefaultModel = () => types.optional(NotiModel, {})
