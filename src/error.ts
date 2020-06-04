export default function logError(title: string, value: string): void {
  console.log(`%c${title}: %c${value}`, "color: #bada55", "color: red");
}
