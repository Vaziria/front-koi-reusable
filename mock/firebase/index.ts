import { mockFirebase } from 'firestore-jest-mock'
import { mockCollection } from 'firestore-jest-mock/mocks/firestore'

mockFirebase({
  database: {}
})
export const firestore = mockCollection()
