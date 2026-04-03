export type SocialLink = {
  label: string;
  url: string;
};

export type SiteConfig = {
  siteName: string;
  siteDescription: string;
  author: string;
  domain?: string;
  repoUrl: string;
  basePath: string;
  socialLinks: SocialLink[];
};

export const siteConfig: SiteConfig = {
  siteName: "Willbon Atlas",
  siteDescription: "Willbon 的技术博客与导航图谱，收纳开发灵感、实践记录与常用资源。",
  author: "willbon-dev",
  domain: "",
  repoUrl: "git@github.com:willbon-dev/Atlas.git",
  basePath: "/Atlas",
  socialLinks: [
    { label: "GitHub", url: "https://github.com/willbon-dev" },
    { label: "邮箱", url: "mailto:willbon.dev@gmail.com" }
  ]
};

export const siteOrigin = siteConfig.domain?.trim()
  ? `https://${siteConfig.domain.trim().replace(/^https?:\/\//, "")}`
  : "https://willbon-dev.github.io";

export const siteUrl = `${siteOrigin}${siteConfig.basePath}`;

export const seoDefaults = {
  title: siteConfig.siteName,
  description: siteConfig.siteDescription
};