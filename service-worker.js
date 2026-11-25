/* ====================================
   CACHE
==================================== */

const CACHE_NAME = "charge-ev-v4";

const FILES_TO_CACHE = [

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
                        FILES_TO_CACHE
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

        /* Navigation */

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
                        "./offline.html"
                    );

                })

            );

            return;
        }

        /* Fichiers */

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

                    return caches
                        .open(CACHE_NAME)

                        .then(cache => {

                            cache.put(
                                event.request,
                                networkResponse.clone()
                            );

                            return networkResponse;

                        });

                });

            })

        );

    }
);

/* ====================================
   MESSAGE UPDATE
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
