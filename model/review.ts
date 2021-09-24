export interface IkanReviewData {
  price: number
  name: string
  image: string
}

export interface IReview {
  userid: string
  shopid: string
  orderid: string
  ikans: IkanReviewData[]
  rating: number
  media?: string[]
  msg: string
  created: number
}
