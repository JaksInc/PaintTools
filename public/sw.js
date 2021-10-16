const version = "0.0.2"

const assets = [
    "./",
    "./all-pages.css",
    "./scaler.html",
    "./combiner.html",
    "./images/brushIcon-128.png",
    "./images/brushIcon-144.png",
    "./images/brushIcon-192.png",
    "./images/brushIcon-512.png"
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
