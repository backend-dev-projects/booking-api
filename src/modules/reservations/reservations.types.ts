export interface Reservation {
  user_id: string;
  resource_id: number;
  start_time: Date;
  end_time: Date;
  reserved_capacity: number;
}
