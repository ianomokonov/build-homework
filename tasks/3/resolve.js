import fs from "node:fs";
import path from "node:path";

const packageJSON = JSON.parse(fs.readFileSync("./package.json", "utf-8"));

const { imports } = packageJSON;
const rootDir = path.resolve(".");

const extensionsToResolve = ["js", "ts", "json"];

export function resolve(importPath, parentPath) {
  const resolvedAlias = resolveAlias(importPath);
  if (resolvedAlias) {
    const resolved = path.resolve(rootDir, resolvedAlias);
    if (isFileExists(resolved)) {
      return resolved;
    }
    const pathWithExt = resolveExt(resolved);

    if (pathWithExt) {
      return pathWithExt;
    }
    return null;
  }
  const resolvedModulePath = path.resolve(path.dirname(parentPath), importPath);

  if (isFileExists(resolvedModulePath)) {
    return resolvedModulePath;
  }

  const pathWithExt = resolveExt(resolvedModulePath);

  if (pathWithExt) {
    return pathWithExt;
  }

  return null;
}

function resolveAlias(pathname) {
  if (!pathname.includes("#")) {
    return null;
  }
  for (const [alias, target] of Object.entries(imports)) {
    const aliasPath = alias.split("*")[0];
    const targetPath = target.split("*")[0];

    if (pathname.includes(aliasPath)) {
      return pathname.replace(aliasPath, targetPath);
    }
  }
  return null;
}

function resolveExt(pathname) {
  if (!pathname) {
    return null;
  }

  if (path.extname(pathname)) {
    return isFileExists(pathname);
  }

  for (const ext of extensionsToResolve) {
    const pathWithExt = `${pathname}.${ext}`;

    if (isFileExists(pathWithExt)) {
      return pathWithExt;
    }
  }

  return null;
}

function isFileExists(filePath) {
  try {
    fs.readFileSync(filePath);
    return filePath;
  } catch (err) {
    return null;
  }
}
