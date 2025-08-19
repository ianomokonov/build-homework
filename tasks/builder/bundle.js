import fs from "node:fs";
import path from "node:path";

/**
 * Примерный алгоритм работы бандлера:
 * 1. Прочитать entry и собрать список всех вызовов require
 * 2. Пройтись по полученным require (они могут быть вложенными)
 * 3. На выходе получится массив с исходным кодом всех модулей
 * 4. Склеить всё воедино обернув модули и entry в новый рантайм
 *
 * Для чтения файлов используйте fs.readFileSync
 * Для резолва пути до модуля испльзуйте path.resolve (вам нужен путь до родителя где был вызван require)
 * Пока что сборщик упрощен, считаем что require из node_modules нет
 */

/**
 * @param {string} entryPath - путь к entry бандлинга
 */
export function bundle(entryPath) {
  const entryFile = fs.readFileSync(entryPath, "utf-8");
  const requireCalls = searchRequireCalls(entryFile).map((modulePath) => ({
    modulePath,
    parent: entryPath,
  }));

  const modules = [];
  const header = `
  const modules = {};
  function require(id) {
    modules[id](require, modules[id]);
    return modules[id].exports;
  }
  `;
  const entry = `(function(require, module) { ${entryFile} })(require, modules)`

  while (requireCalls.length) {
    const { modulePath, parent } = requireCalls.pop();
    const resolvedModulePath = path.resolve(path.dirname(parent), modulePath);

    const moduleCode = fs.readFileSync(resolvedModulePath, "utf-8");
    const moduleRequireCalls = searchRequireCalls(moduleCode).map((m) => ({
      modulePath: m,
      parent: resolvedModulePath,
    }));
    requireCalls.push(...moduleRequireCalls);
    modules.push(`modules['${modulePath}'] = function(require, module) { ${moduleCode} };`);
  }

  return `${header}\n${modules.join('\n')}\n${entry}`;
}

/**
 * Функция для поиска в файле вызовов require
 * Возвращает id модулей
 * @param {string} code
 */
function searchRequireCalls(code) {
  return [...code.matchAll(/require\(('|")(.*)('|")\)/g)].map(
    (item) => item[2]
  );
}
