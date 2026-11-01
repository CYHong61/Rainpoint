/* 레인 포인트 주민 앱: 한 번 열면 오프라인에서도 열리도록 앱 파일을 저장해 둡니다.
   파일을 고친 뒤에는 VERSION 숫자를 올려야 사용자 기기에 새 버전이 반영됩니다. */
const VERSION = "rp-app-v1";
const FILES = ["./", "./index.html", "./dong.js", "./manifest.webmanifest",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;            // 글꼴 등 외부 파일은 브라우저에 맡김
  e.respondWith(
    fetch(e.request).then(res => {                       // 온라인이면 최신 파일, 받은 파일은 저장
      const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return res;
    }).catch(() => caches.match(e.request).then(r => r || caches.match("./index.html")))
  );
});
