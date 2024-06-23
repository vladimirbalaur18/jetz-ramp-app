export function formatTime(time: {
  hours: number | string;
  minutes: number | string;
}) {
  let hours = time.hours;
  let minutes = time.minutes;

  // Ensure hours and minutes are two digits
  hours = Number(hours) < 10 ? "0" + hours : hours;
  minutes = Number(minutes) < 10 ? "0" + minutes : minutes;

  return `${hours}:${minutes}`;
}
