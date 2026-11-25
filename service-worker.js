/* ====================================
   CONFIGURATION
==================================== */

const CACHE_NAME = "charge-ev-v6";

const APP_FILES = [

    "./",
    "./index.html",
    "./style.css",
    "./app.js",

    "./manifest.json",
    "./offline.html",

    "./icons/icon-192.png",
    "./icons/icon-512.png"

];

/* ====================================
   INSTALLATION
==================================== */

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches
                .open(CACHE_NAME)

                .then(cache => {

                    return cache.addAll(
                        APP_FILES
                    );

                })

        );

        self.skipWaiting();

    }
);

/* ====================================
   ACTIVATION
==================================== */

self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches.keys()

                .then(keys => {

                    return Promise.all(

                        keys.map(key => {

                            if (
                                key !== CACHE_NAME
                            ) {

                                return caches.delete(
                                    key
                                );

                            }

                        })

                    );

                })

        );

        self.clients.claim();

    }
);

/* ====================================
   FETCH
==================================== */

self.addEventListener(
    "fetch",
    event => {

        if (
            event.request.method !== "GET"
        ) {
            return;
        }

        event.respondWith(

            caches.match(
                event.request
            )

            .then(cacheResponse => {

                if (
                    cacheResponse
                ) {

                    return cacheResponse;
                }

                return fetch(
                    event.request
                )

                .then(networkResponse => {

                    if (
                        !networkResponse ||
                        networkResponse.status !== 200
                    ) {

                        return networkResponse;
                    }

                    const responseClone =
                        networkResponse.clone();

                    caches
                        .open(CACHE_NAME)

                        .then(cache => {

                            cache.put(
                                event.request,
                                responseClone
                            );

                        });

                    return networkResponse;

                })

                .catch(() => {

                    if (
                        event.request.mode ===
                        "navigate"
                    ) {

                        return caches.match(
                            "./offline.html"
                        );

                    }

                });

            })

        );

    }
);

/* ====================================
   MISE A JOUR
==================================== */

self.addEventListener(
    "message",
    event => {

        if (
            event.data &&
            event.data.type ===
            "SKIP_WAITING"
        ) {

            self.skipWaiting();

        }

    }
);
