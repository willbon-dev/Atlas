import path from "node:path";
import { readFile } from "node:fs/promises";
import yaml from "js-yaml";

export type NavItem = {
  title: string;
  url: string;
  description: string;
  tags?: string[];
  featured?: boolean;
  icon?: string;
};

export type NavCategory = {
  title: string;
  description: string;
  links: NavItem[];
};

type NavigationFile = {
  categories: NavCategory[];
};

const navigationPath = path.join(process.cwd(), "src", "data", "navigation.yml");

export async function getNavigation(): Promise<NavCategory[]> {
  const source = await readFile(navigationPath, "utf-8");
  const parsed = yaml.load(source) as NavigationFile;
  return parsed.categories ?? [];
}

export async function getFeaturedLinks(): Promise<NavItem[]> {
  const categories = await getNavigation();
  return categories.flatMap((category) =>
    category.links
      .filter((link) => link.featured)
      .map((link) => ({ ...link, tags: link.tags ?? [] }))
  );
}

