// const moment = require("moment")

// console.log(moment.locales()); // ["en"]

const cp = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

let momentLocales = fs
  .readdirSync("./node_modules/moment/dist/locale")
  .map((locale) => path.basename(locale, ".js"));
momentLocales = new Set(momentLocales);

// Fetch all locales (or at least locales with >=10% translations).
let fxaLocales = cp.execSync("npx pdehaan/pontoonql firefox-accounts 10");
fxaLocales = JSON.parse(fxaLocales).reduce((acc, { locale, progress }) => {
  acc[locale.code.toLowerCase()] = progress;
  return acc;
}, {});

for (let locale of Object.keys(fxaLocales).sort()) {
  if (!momentLocales.has(locale)) {
    console.error(
      `moment is missing FxA "${locale}" locale (${Math.round(
        fxaLocales[locale]
      )}%)`
    );
    process.exitCode = 1;
  }
}
