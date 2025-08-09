import { config } from "dotenv";

config();

interface SalesChannelLookup {
  name: string;
  slogan: string | null;
  logo: string;
}

export async function GET(req: Request): Promise<Response> {
  const domain = req.headers.get("host");

  if (!process.env.OLYMPUS_URL) {
    throw new Error("OLYMPUS_URL environment variable is not defined");
  }
  try {
    const query = `
            query SalesChannelLookup($domain: String!) {
                salesChannelLookupByDomain(domain: $domain) {
                    name
                    slogan
                    logo
                    customer_identity_store_id
                    facebook_url
                }
            }
        `;

    const response = await fetch(process.env.OLYMPUS_URL + "/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { domain },
      }),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data.data.salesChannelLookupByDomain), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error looking up sales channel:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to lookup sales channel",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
