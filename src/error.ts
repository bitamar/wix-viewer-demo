export default function logError(title: string, value: string): void {
  // eslint-disable-next-line no-console
  console.log(`%c${title}: %c${value}`, "color: #bada55", "color: red");
}
