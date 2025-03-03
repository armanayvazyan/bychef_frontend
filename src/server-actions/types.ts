export interface IFetchChefsProps {
  pageParam: number,
  dateFrom?: string,
  dateTo?: string,
  onErrorCb?: (errorKey: string) => void,
}

export interface IPlaceOrderProps {
  doorToDoorEnabled: boolean,
  addressDto: {
    country: string,
    city: string,
    region: string,
    street: string,
    entrance: string,
    home: string,
    floor: string,
    coordinates: number[]
  },
  note: string,
  receiverPhoneNumber: string,
  receiverEmail: string,
  chefId: number,
  deliveryDateTime: string,
  paymentType: string,
  createOrderDishes: {
    selectedSpiceLevel: number | null,
    quantity: number,
    dishAdditionIds: number[] | [],
    dishId: number,
  }[],
}