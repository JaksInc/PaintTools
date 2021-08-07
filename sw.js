const assets = [
    "/",
    "/scaler.html",
    "/images/brushIcon-144.png",
    "/images/brushIcon-192.png",
    "/images/brushIcon-512.png"
]

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
      caches.open("sw-cache").then(cache => {
        cache.addAll(assets)
      })
    )
  })

  self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
  })