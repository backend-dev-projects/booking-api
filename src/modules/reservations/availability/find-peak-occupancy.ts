export interface ReservationEndpoint {
  readonly reserved_capacity: number;
  readonly time: Date;
}

/**
 * Finds the maximum simultaneous reserved capacity.
 *
 * Preconditions:
 * - starts and ends represent the same reservations.
 * - Both arrays are sorted by time ascending.
 * - Every reservation has start < end.
 * - Weights are positive.
 *
 * Time: O(n)
 * Extra space: O(1)
 */
export function findPeakOccupancy(
  starts: readonly ReservationEndpoint[],
  ends: readonly ReservationEndpoint[],
): number {
  let start_index = 0;
  let end_index = 0;
  let occupied_capacity = 0;
  let peak_capacity = 0;

  while (start_index < starts.length) {
    const next_start = starts[start_index]!;
    const next_end = ends[end_index]!;

    if (next_end.time <= next_start.time) {
      occupied_capacity -= next_end.reserved_capacity;
      ++end_index;
    } else {
      occupied_capacity += next_start.reserved_capacity;
      ++start_index;
    }

    if (occupied_capacity > peak_capacity) peak_capacity = occupied_capacity;
  }

  return peak_capacity;
}
