/**
 *
 * @param gulp
 * @param {object} plugins - gulp плагины
 * @param {string} flag - флаг таска
 * @returns {Function} - возврат таска
 */

import { deleteAsync } from "del";

export default function (gulp, flag) {
  // Очистка дирректории dist
  return function () {
    return deleteAsync("./dist/**");
  };
}
