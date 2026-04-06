const test = require("node:test");
const assert = require("node:assert/strict");

const {
  getBlockedNavigationTarget,
  shouldBlockPath,
} = require("../src/logic/navigation.cjs");

test("blocks direct YouTube Shorts paths", () => {
  assert.equal(shouldBlockPath("/shorts/abc123"), true);
  assert.equal(shouldBlockPath("/watch?v=abc123"), false);
});

test("builds a blocked page URL for Shorts navigation", () => {
  const target = getBlockedNavigationTarget(
    "https://www.youtube.com/shorts/abc123?feature=share",
    "chrome-extension://testid/blocked.html",
  );

  assert.equal(
    target,
    "chrome-extension://testid/blocked.html?source=https%3A%2F%2Fwww.youtube.com%2Fshorts%2Fabc123%3Ffeature%3Dshare",
  );
});

test("ignores non-shorts YouTube pages", () => {
  const target = getBlockedNavigationTarget(
    "https://www.youtube.com/watch?v=abc123",
    "chrome-extension://testid/blocked.html",
  );

  assert.equal(target, null);
});
