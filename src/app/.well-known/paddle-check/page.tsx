// Paddle domain verification helper
// Returns token from PADDLE_DOMAIN_TOKEN env if present, else 404

export const revalidate = 0;

export async function generateMetadata() {
  return {
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function PaddleDomainCheck() {
  const token = process.env.PADDLE_DOMAIN_TOKEN;

  if (!token) {
    return (
      <html>
        <body>
          <h1>404 - Not Found</h1>
        </body>
      </html>
    );
  }

  return (
    <html>
      <body>
        <pre>{token}</pre>
      </body>
    </html>
  );
}
