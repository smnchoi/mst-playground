import { NotiModel } from "./Noti"

test("can be created", () => {
  const instance = NotiModel.create({})

  expect(instance).toBeTruthy()
})
