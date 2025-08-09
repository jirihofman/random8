export async function GET() {
  return new Response('User-Agent: *\nAllow: /', {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}