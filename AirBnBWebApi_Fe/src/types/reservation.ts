export interface Reservation {
  reservationId?: string;
  propertyId: string;
  userId: string;
  guestName: string;
  propertyName: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number,
  totalPrice?: number;
  specialRequest?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Revenue {
  currentMonthIncome: number,
  chartDatas: ChartData[]
}

export interface ChartData {
  date: string,
  income: number
}
