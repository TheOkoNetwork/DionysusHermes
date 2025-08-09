export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Dionysus Hermes",
  description: "Flexible event ticketing",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "My orders",
      href: "/orders",
    },
  ],
  navMenuItems: [
    {
      label: "My orders",
      href: "/orders",
    },
  ],
  links: {
    facebook: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
