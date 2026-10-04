export type StoredReservation = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  comment: string;
};

export function reservationToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Moscow", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}
