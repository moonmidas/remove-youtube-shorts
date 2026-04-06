"use strict";

const SHORTS_SURFACE_SELECTOR = [
  "ytd-reel-shelf-renderer",
  "ytd-rich-shelf-renderer[is-shorts]",
  'ytd-guide-entry-renderer a[title="Shorts"]',
  'ytd-mini-guide-entry-renderer a[title="Shorts"]',
  'tp-yt-paper-tab a[href="/shorts"]',
  'a[title="Shorts"]',
].join(", ");

const REMOVABLE_SHORTS_CONTAINER_SELECTOR = [
  "ytd-rich-section-renderer",
  "ytd-reel-shelf-renderer",
  "ytd-rich-item-renderer",
  "ytd-grid-video-renderer",
  "ytd-video-renderer",
  "ytd-compact-video-renderer",
  "ytd-guide-entry-renderer",
  "ytd-mini-guide-entry-renderer",
  "ytm-shorts-lockup-view-model",
  "ytm-shorts-lockup-view-model-v2",
].join(", ");

function removeNode(node) {
  if (node && typeof node.remove === "function") {
    node.remove();
  }
}

function pruneShortsFromDocument(root) {
  for (const node of root.querySelectorAll(SHORTS_SURFACE_SELECTOR)) {
    const removable =
      typeof node.closest === "function"
        ? node.closest(REMOVABLE_SHORTS_CONTAINER_SELECTOR)
        : null;
    removeNode(removable || node);
  }

  for (const anchor of root.querySelectorAll('a[href*="/shorts/"]')) {
    const removable =
      typeof anchor.closest === "function"
        ? anchor.closest(REMOVABLE_SHORTS_CONTAINER_SELECTOR)
        : null;
    removeNode(removable || anchor);
  }
}

function shouldReplaceCurrentPage(pathname) {
  return typeof pathname === "string" && pathname.startsWith("/shorts/");
}

function getBlockedPageUrl() {
  const blockedUrl = new URL(chrome.runtime.getURL("blocked.html"));
  blockedUrl.searchParams.set("source", window.location.href);
  return blockedUrl.toString();
}

if (shouldReplaceCurrentPage(window.location.pathname)) {
  window.location.replace(getBlockedPageUrl());
} else {
  const runPrune = () => pruneShortsFromDocument(document);

  runPrune();

  const observer = new MutationObserver(() => {
    runPrune();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}
