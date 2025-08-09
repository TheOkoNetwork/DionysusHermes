import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";

interface CustomerOrder {
  id: string; // Assuming the id is a string based on your usage
  order_key: string;
  tickets: Ticket[];
}

interface Ticket {
  id: string;
  barcode: string;
  ticketProduct: string;
  ticketClass: string;
}

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ order_id: string }>;
  },
): Promise<NextResponse<unknown>> {
  const page_params = await params;
  const order_id = page_params['order_id'][0];

  console.log("order_id:", order_id)
  const session = await getServerSession(authOptions);

  console.log("Session:", session);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!process.env.OLYMPUS_URL) {
    throw new Error("OLYMPUS_URL environment variable is not defined");
  }
  try {
    const query = `query qryCustomerOrder($customerOrderId: String!) { customerOrder(id: $customerOrderId) { id order_key tickets { id barcode product { id name } type { name } } } }`;

    const response = await fetch(process.env.OLYMPUS_URL + "/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        query,
        variables: {
          customerOrderId: order_id,
        },
      }),
    });

    const responseJson = await response.json()

    console.log("GraphQL Response Data:", responseJson);

    // Assuming the GraphQL response structure matches the query
    const order: CustomerOrder = {
      id: responseJson.data.customerOrder.id,
      // Using order_key from GraphQL response if available, otherwise fallback to id
      order_key: responseJson.data.customerOrder.order_key,
      tickets: responseJson.data.customerOrder.tickets.map(function (ticket: {
        id: any;
        barcode: any;
        product: { name: any };
        type: { name: any };
      }) {
        return {
          id: ticket.id,
          barcode: ticket.barcode,
          ticketProduct: ticket.product.name,
          ticketType: ticket.type.name,
        };
      }),
    };

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching customer order:", error);

    return NextResponse.json(
      { error: "Error fetching customer order" },
      { status: 500 },
    );
  }
}
