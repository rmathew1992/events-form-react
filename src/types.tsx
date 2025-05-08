export interface TicketType {
  type: string
  name: string
  description: string
  cost: number
}

export interface BandEvent {
  name: string
  id: string
  date: number
  location: string
  description_blurb: string
  imgUrl: string
  ticketTypes: TicketType[]
}
