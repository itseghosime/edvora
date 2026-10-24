import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://edvora-sage.vercel.app").replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/student", "/api/", "/login", "/account/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}


