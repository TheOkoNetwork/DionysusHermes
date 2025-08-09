"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { SocialIcon } from "react-social-icons";
import { signOut } from "next-auth/react";

import { useConfigStore } from "@/stores/useConfigStore";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";

export const Navbar = () => {
  const config = useConfigStore((state) => state.config);
  const { data: session, status } = useSession();

  if (!config) return <div>Loading config...</div>;

  const AuthButton = () => {
    if (status === "loading") {
      return (
        <Button isLoading variant="flat">
          Loading...
        </Button>
      );
    }

    if (session) {
      return (
        <Button color="danger" variant="flat" onClick={() => signOut()}>
          Sign Out
        </Button>
      );
    }

    return (
      <Button
        color="primary"
        variant="flat"
        onClick={() => (window.location.href = "/signin")}
      >
        Sign In
      </Button>
    );
  };

  /*
  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );
*/
  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <img alt="" src={config.logo} style={{ height: "50px" }} />
            {/* <p className="font-bold text-inherit">ACME</p> */}
          </NextLink>
        </NavbarBrand>
        {config && (
          <ul className="hidden lg:flex gap-4 justify-start ml-2">
            {siteConfig.navItems.map((item) => (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium",
                  )}
                  color="foreground"
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            ))}
          </ul>
        )}
      </NavbarContent>

      {config && (
        <NavbarContent
          className="hidden sm:flex basis-1/5 sm:basis-full"
          justify="end"
        >
          <NavbarItem className="hidden sm:flex gap-2">
            <SocialIcon url={config.facebook_url} />
            <ThemeSwitch />
          </NavbarItem>
          {/* <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
          <NavbarItem className="hidden md:flex">
            <Button
              isExternal
              as={Link}
              className="text-sm font-normal text-default-600 bg-default-100"
              href={siteConfig.links.sponsor}
              startContent={<HeartFilledIcon className="text-danger" />}
              variant="flat"
            >
              Sponsor
            </Button>
          </NavbarItem> */}
        </NavbarContent>
      )}
      {config && (
        <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
          <SocialIcon url={config.facebook_url} />
          <ThemeSwitch />
          <NavbarMenuToggle />
        </NavbarContent>
      )}

      <NavbarMenu>
        {/* {searchInput} */}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href={item.href}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>

      <NavbarContent justify="end">
        <NavbarItem>
          <AuthButton />
        </NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
};
