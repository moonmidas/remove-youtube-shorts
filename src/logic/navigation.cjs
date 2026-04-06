function shouldBlockPath(pathname) {
  return typeof pathname === "string" && pathname.startsWith("/shorts/");
}

function getBlockedNavigationTarget(rawUrl, blockedPageUrl) {
  if (!rawUrl || !blockedPageUrl) {
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
    const blockedUrl = new URL(blockedPageUrl);
    blockedUrl.searchParams.set("source", rawUrl);
    return blockedUrl.toString();
  }

  return null;
}

module.exports = {
  getBlockedNavigationTarget,
  shouldBlockPath,
};
