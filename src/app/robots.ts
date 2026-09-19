import type { MetadataRoute } from "next";

const BASE_URL = "https://www.rombilde.no";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/betaling/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
