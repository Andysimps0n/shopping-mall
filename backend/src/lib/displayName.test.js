import assert from "node:assert/strict";
import test from "node:test";
import { DISPLAY_NAME_MAX, parseDisplayName } from "./displayName.js";

test("display name trims and collapses spaces", () => {
  assert.deepEqual(parseDisplayName("  김  은찬  "), { ok: true, name: "김 은찬" });
});

test("display name rejects an empty value", () => {
  assert.deepEqual(parseDisplayName("   "), { ok: false, error: "name_required" });
  assert.deepEqual(parseDisplayName(null), { ok: false, error: "name_required" });
});

test("display name rejects a value past the shared limit", () => {
  const tooLong = "가".repeat(DISPLAY_NAME_MAX + 1);
  assert.deepEqual(parseDisplayName(tooLong), { ok: false, error: "name_too_long" });
  assert.equal(parseDisplayName("가".repeat(DISPLAY_NAME_MAX)).ok, true);
});
