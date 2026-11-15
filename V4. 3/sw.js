// v4.3 offline support. Network-first: new uploads always show, a missing page is never stuck as a saved 404.
const V = "rebar-v4.3";
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];
const TW = "https://cdn.tailwindcss.com/3.4.17";
self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(V);
    for (const u of CORE) { try { await c.add(u); } catch (_) {} }
    try { await c.put(TW, await fetch(TW, { mode: "no-cors" })); } catch (_) {}
    self.skipWaiting();
  })());
});
self.addEventListener("activate", e => e.waitUntil(clients.claim()));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then(res => {
    if (res.ok || res.type === "opaque") { const cp = res.clone(); caches.open(V).then(c => c.put(e.request, cp)); }
    return res;
  }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
