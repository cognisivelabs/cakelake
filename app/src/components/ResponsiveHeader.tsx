import { PageHeader, type PageHeaderProps } from "@/components/PageHeader";
import { Header } from "@/components/Header";

/**
 * The mobile PageHeader / desktop Header pair shown at the top of every
 * sub-page (Menu, Find us, Item detail, Your order) — one component
 * instead of each page repeating the same mobileHeaderWrap/
 * desktopHeaderWrap div pair and its identical CSS display toggle.
 */
export function ResponsiveHeader(props: PageHeaderProps) {
  return (
    <>
      <div className="mobile-header-wrap">
        <PageHeader {...props} />
      </div>
      <div className="desktop-header-wrap">
        <Header />
      </div>
    </>
  );
}
