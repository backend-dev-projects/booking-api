interface ReservationPeriod {
  requested_start: Date;
  requested_end: Date;
}

// Configure this for the location of your coworking space.
const BUSINESS_TIME_ZONE = "Europe/Dublin";

const OPEN_SECONDS = 8 * 60 * 60;
const CLOSE_SECONDS = 22 * 60 * 60;

const WORKING_DAYS = new Set(["Mon", "Tue", "Wed", "Thu", "Fri"]);

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: BUSINESS_TIME_ZONE,
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

export function hasValidInterval({
  requested_start,
  requested_end,
}: ReservationPeriod): boolean {
  return requested_end.getTime() > requested_start.getTime();
}

export function startsInFuture({
  requested_start,
}: ReservationPeriod): boolean {
  return requested_start.getTime() > Date.now();
}

export function isWithinBookingHorizon({
  requested_end,
}: ReservationPeriod): boolean {
  const deadline = new Date();
  deadline.setUTCFullYear(deadline.getUTCFullYear() + 1);

  return requested_end.getTime() <= deadline.getTime();
}

export function isWithinWorkingHour(value: Date): boolean {
  const date = value;

  const parts = Object.fromEntries(
    formatter.formatToParts(date).map(({ type, value }) => [type, value]),
  );

  const seconds =
    Number(parts.hour) * 3600 +
    Number(parts.minute) * 60 +
    Number(parts.second) +
    date.getUTCMilliseconds() / 1000;

  return seconds >= OPEN_SECONDS && seconds <= CLOSE_SECONDS;
}

export function isWithinWorkingDays(value: Date): boolean {
  const date = value;

  const parts = Object.fromEntries(
    formatter.formatToParts(date).map(({ type, value }) => [type, value]),
  );

  return WORKING_DAYS.has(parts.weekday ?? "");
}
