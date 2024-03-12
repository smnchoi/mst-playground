import { NotiStoreModel } from "./NotiStore"

test("can be created", () => {
  const instance = NotiStoreModel.create({})

  expect(instance).toBeTruthy()
})
