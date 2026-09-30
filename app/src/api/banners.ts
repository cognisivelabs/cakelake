import type { Banner } from "@/types/banner";
import { HOME_BANNERS } from "@/data/banners";

// The internal banner API: stands in for a backend endpoint and is the
// only code that reads the banner data file.

/** Home's hero banners, in rotation order. */
export async function fetchBanners(): Promise<Banner[]> {
  return HOME_BANNERS;
}
