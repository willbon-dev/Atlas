import { siteConfig } from "../config/site";

export function isRemoteAsset(value?: string): boolean {
  return Boolean(value && /^https?:\/\//i.test(value));
}

export function resolveAssetPath(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  if (isRemoteAsset(value)) {
    return value;
  }

  const normalized = `/${value.replace(/^\/?/, "").replace(/^\.?\//, "")}`;
  const base = siteConfig.basePath === "/" ? "" : siteConfig.basePath;
  return normalized.startsWith(base) ? normalized : `${base}${normalized}`;
}

