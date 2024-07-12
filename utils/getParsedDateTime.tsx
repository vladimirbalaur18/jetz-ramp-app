import dayjs from "dayjs";

const getParsedDateTime = (
  date: Date,
  time: { hours: number; minutes: number }
) =>
  dayjs(date)
    .set("hour", time.hours || 0)
    .set("minutes", time.minutes || 0)
    .set("seconds", 0);

export default getParsedDateTime;
