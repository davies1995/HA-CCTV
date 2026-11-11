/**
 * Guard: recordings.py must not import the broken homeassistant.util.slugify
 * submodule path (ModuleNotFoundError on current HA Core).
 */
import { readFileSync } from "node:fs";

const src = readFileSync(
  new URL("../custom_components/cctv_dashboard/recordings.py", import.meta.url),
  "utf8"
);

if (/from homeassistant\.util\.slugify import/.test(src) && !/except ImportError/.test(src)) {
  throw new Error(
    "recordings.py uses bare homeassistant.util.slugify import (breaks HA setup)"
  );
}

if (!/from homeassistant\.util import slugify/.test(src)) {
  throw new Error("recordings.py should import slugify from homeassistant.util");
}

console.log("slugify-import checks ok");
