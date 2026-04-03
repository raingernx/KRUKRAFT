import type { MetadataRoute } from "next";
import { getBuildSafePublicPlatformConfig } from "@/services/platform";

export default function robots(): MetadataRoute.Robots {
  const platform = getBuildSafePublicPlatformConfig();
  const siteUrl = platform.siteUrl.trim();
  const rules: MetadataRoute.Robots["rules"] = {
    userAgent: "*",
    allow: "/",
  };

  if (!siteUrl) {
    return { rules };
  }

  return {
    rules,
    host: siteUrl,
  };
}
