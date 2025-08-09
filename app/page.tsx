"use client";

import { Card, CardBody, CardFooter, Image } from "@heroui/react";
import { useSession } from "next-auth/react";

import { title, subtitle } from "@/components/primitives";
import { useConfigStore } from "@/stores/useConfigStore";

export default function Home() {
  const { data: session, status } = useSession();

  const config = useConfigStore((state) => state.config);

  if (!config) return <div>Loading config...</div>;

  const events_list: any[] = [];

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>{config.name}</span>
        <div className={subtitle({ class: "mt-4" })}>{config.slogan}</div>
        {status === "authenticated" && (
          <div className={subtitle({ class: "mt-4" })}>
            Welcome {session.user?.name}!
          </div>
        )}
      </div>

      {events_list.length === 0 && (
        <div className="flex gap-3">
          <div className={subtitle({ class: "mt-4" })}>
            No events currently on sale.
          </div>
        </div>
      )}

      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
        {events_list.map((item, index) => (
          /* eslint-disable no-console */
          <Card
            key={index}
            isPressable
            shadow="sm"
            onPress={() => console.log("item pressed")}
          >
            <CardBody className="overflow-visible p-0">
              <Image
                alt={item.title}
                className="w-full object-cover h-[140px]"
                radius="lg"
                shadow="sm"
                src={item.img}
                width="100%"
              />
            </CardBody>
            <CardFooter className="text-small justify-between">
              <b>{item.title}</b>
              <p className="text-default-500">{item.price}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
