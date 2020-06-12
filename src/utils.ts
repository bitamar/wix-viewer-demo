export default function logError(title: string, value: string): void {
  console.log(`%c${title}: %c${value}`, "color: #bada55", "color: red");
}

export async function fetchJson<T>(request: RequestInfo): Promise<T> {
  const response = await fetch(request);
  return response.json();
}

export async function fetchText(request: RequestInfo): Promise<string> {
  const response = await fetch(request);
  return response.text();
}
