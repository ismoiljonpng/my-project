import { SiteChrome } from "@/components/layout/site-chrome";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteChrome>{children}</SiteChrome>;
}
