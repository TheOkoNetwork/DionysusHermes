import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";

interface CustomerOrder {
  id: string;
  order_key: string;
}

export async function GET(): Promise<void | Response>{
  const session = await getServerSession(authOptions);

  console.log("Session:", session);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!process.env.OLYMPUS_URL) {
    throw new Error("OLYMPUS_URL environment variable is not defined");
  }
  try {
    const query = `query qryCustomerOrdersList {
            customerOrders {
                id
                order_key
                description
            }
        }`;

    const response = await fetch(process.env.OLYMPUS_URL + "/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        query,
        variables: {},
      }),
    });

    const data = await response.json();

    console.log(data);

    return new Response(JSON.stringify(data.data.customerOrders), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching list of orders:", error);

    return new Response(JSON.stringify({
      error: "Failed to fetch customer orders"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });

  }
}
