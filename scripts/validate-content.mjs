import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const navigationPath = fileURLToPath(new URL("../src/data/navigation.yml", import.meta.url));

const source = await readFile(navigationPath, "utf-8");
const parsed = yaml.load(source);

if (!parsed || !Array.isArray(parsed.categories)) {
  throw new Error("navigation.yml must contain a categories array.");
}

for (const category of parsed.categories) {
  if (!category.title || !Array.isArray(category.links)) {
    throw new Error("Each navigation category must have a title and links.");
  }

  for (const link of category.links) {
    for (const field of ["title", "url", "description"]) {
      if (!link[field]) {
        throw new Error(`Navigation link is missing required field: ${field}`);
      }
    }
  }
}

console.log("Navigation data looks good.");
