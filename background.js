"use strict";

function shouldBlockPath(pathname) {
  return typeof pathname === "string" && pathname.startsWith("/shorts/");
}

function getBlockedNavigationTarget(rawUrl) {
  if (!rawUrl) {
    return null;
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    return null;
  }

  if (
    (parsedUrl.hostname === "www.youtube.com" ||
      parsedUrl.hostname === "youtube.com" ||
      parsedUrl.hostname === "m.youtube.com") &&
    shouldBlockPath(parsedUrl.pathname)
  ) {
    const blockedUrl = new URL(chrome.runtime.getURL("blocked.html"));
    blockedUrl.searchParams.set("source", rawUrl);
    return blockedUrl.toString();
  }

  return null;
}

function blockShortsNavigation(details) {
  const targetUrl = getBlockedNavigationTarget(details.url);

  if (!targetUrl || !details.tabId || details.tabId < 0) {
    return;
  }

  chrome.tabs.update(details.tabId, { url: targetUrl });
}

chrome.webNavigation.onCommitted.addListener(blockShortsNavigation, {
  url: [{ hostContains: "youtube.com" }],
});

chrome.webNavigation.onHistoryStateUpdated.addListener(blockShortsNavigation, {
  url: [{ hostContains: "youtube.com" }],
});
