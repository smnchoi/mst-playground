import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

export interface NotiModelType {
  id: number
  title: string
  content: string
  priority: 1 | 2 | 3 // 1=광고, 2=정보, 3=예약
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
    priority: types.number,
    createdAt: types.Date,
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get labelFromPriority() {
      switch (self.priority) {
        case 1:
          return "광고"
        case 2:
          return "정보"
        case 3:
          return "예약"
        default:
          return ""
      }
    },

    get timestamp() {
      const y = self.createdAt.getFullYear()
      const m = self.createdAt.getMonth() + 1
      const d = self.createdAt.getDate()
      return `${y}. ${m}. ${d}`
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Noti extends Instance<typeof NotiModel> {}
export interface NotiSnapshotOut extends SnapshotOut<typeof NotiModel> {}
export interface NotiSnapshotIn extends SnapshotIn<typeof NotiModel> {}
export const createNotiDefaultModel = () => types.optional(NotiModel, {})
