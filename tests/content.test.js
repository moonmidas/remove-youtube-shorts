const test = require("node:test");
const assert = require("node:assert/strict");

const {
  pruneShortsFromDocument,
  shouldReplaceCurrentPage,
} = require("../src/logic/content.cjs");

function createNode(name) {
  return {
    name,
    removed: false,
    remove() {
      this.removed = true;
    },
  };
}

test("replaces Shorts pages in place", () => {
  assert.equal(shouldReplaceCurrentPage("/shorts/clip"), true);
  assert.equal(shouldReplaceCurrentPage("/results"), false);
});

test("removes known Shorts shelves and links", () => {
  const shelf = createNode("shelf");
  const navEntry = createNode("nav");
  const linkContainer = createNode("container");
  const orphanLink = createNode("orphan");

  const anchoredInContainer = {
    closest(selector) {
      assert.match(selector, /ytd-rich-item-renderer/);
      return linkContainer;
    },
    remove() {
      throw new Error("expected container removal instead");
    },
  };

  const anchoredAlone = {
    closest() {
      return null;
    },
    remove() {
      orphanLink.remove();
    },
  };

  const selectorsSeen = [];
  const documentStub = {
    querySelectorAll(selector) {
      selectorsSeen.push(selector);

      if (selector.includes("ytd-reel-shelf-renderer")) {
        return [shelf, navEntry];
      }

      if (selector === 'a[href*="/shorts/"]') {
        return [anchoredInContainer, anchoredAlone];
      }

      return [];
    },
  };

  pruneShortsFromDocument(documentStub);

  assert.equal(shelf.removed, true);
  assert.equal(navEntry.removed, true);
  assert.equal(linkContainer.removed, true);
  assert.equal(orphanLink.removed, true);
  assert.equal(selectorsSeen.includes('a[href*="/shorts/"]'), true);
});
