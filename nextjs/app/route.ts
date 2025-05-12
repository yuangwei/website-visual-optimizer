import getMessage from "./agent";

export async function GET(request: Request) {
  const message = await getMessage()
  return new Response(JSON.stringify({ message: message }));
}
