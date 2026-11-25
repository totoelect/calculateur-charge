/* ====================================
   CACHE
==================================== */

const CACHE_NAME = "charge-ev-v5";

/* Récupère automatiquement le dossier
   GitHub Pages courant */

const BASE_PATH =
    self.location.pathname
        .replace(
            "/service-worker.js",
            ""
        );

const FILES_TO_CACHE = [

    BASE_PATH + "/",
    BASE_PATH + "/index.html",
    BASE_PATH + "/style.css",
    BASE_PATH + "/app.js",

    BASE_PATH + "/manifest.json",
    BASE_PATH + "/offline.html",

    BASE_PATH + "/icons/icon-192.png",
    BASE_PATH + "/icons/icon-512.png"

];

/* ====================================
   INSTALL
==================================== */

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches
                .open(CACHE_NAME)
                .then(cache => {

                    return cache.addAll(
                        FILES_TO_CACHE
                    );

                })

        );

        self.skipWaiting();

    }
);

/* ====================================
   ACTIVATE
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
            event.request.mode ===
            "navigate"
        ) {

            event.respondWith(

                fetch(
                    event.request
                )

                .catch(() => {

                    return caches.match(
                        BASE_PATH +
                        "/offline.html"
                    );

                })

            );

            return;
        }

        event.respondWith(

            caches.match(
                event.request
            )

            .then(response => {

                if (response) {

                    return response;
                }

                return fetch(
                    event.request
                )

                .then(networkResponse => {

                    caches.open(
                        CACHE_NAME
                    )

                    .then(cache => {

                        cache.put(
                            event.request,
                            networkResponse.clone()
                        );

                    });

                    return networkResponse;

                });

            })

        );

    }
);

/* ====================================
   UPDATE
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
