/* ====================================
   CONFIGURATION
==================================== */

const CACHE_NAME = "charge-ev-v3";

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

                    console.log(
                        "Cache créé"
                    );

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

            caches
                .keys()

                .then(keys => {

                    return Promise.all(

                        keys.map(key => {

                            if (
                                key !== CACHE_NAME
                            ) {

                                console.log(
                                    "Cache supprimé",
                                    key
                                );

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

        /* Navigation HTML */

        if (
            event.request.mode ===
            "navigate"
        ) {

            event.respondWith(

                fetch(
                    event.request
                )

                .then(response => {

                    return response;

                })

                .catch(() => {

                    return caches.match(
                        "./offline.html"
                    );

                })

            );

            return;
        }

        /* Fichiers statiques */

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

                })

                .catch(() => {

                    return caches.match(
                        "./offline.html"
                    );

                });

            })

        );

    }
);

/* ====================================
   MESSAGES
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
