/* ==================================
   CONFIGURATION
================================== */

const AMPERAGES = [
    8,
    10,
    12,
    14,
    16,
    20,
    25,
    32
];

/* ==================================
   SAUVEGARDE
================================== */

function sauvegarder() {

    localStorage.setItem(
        "capacite",
        document.getElementById("capacite").value
    );

    localStorage.setItem(
        "actuel",
        document.getElementById("actuel").value
    );

    localStorage.setItem(
        "cible",
        document.getElementById("cible").value
    );

    localStorage.setItem(
        "amp",
        document.getElementById("amp").value
    );

    localStorage.setItem(
        "phase",
        document.getElementById("phase").value
    );
}

/* ==================================
   CHARGEMENT
================================== */

function chargerPreferences() {

    const capacite =
        localStorage.getItem("capacite");

    const actuel =
        localStorage.getItem("actuel");

    const cible =
        localStorage.getItem("cible");

    const amp =
        localStorage.getItem("amp");

    const phase =
        localStorage.getItem("phase");

    if (capacite !== null)
        document.getElementById("capacite").value = capacite;

    if (actuel !== null)
        document.getElementById("actuel").value = actuel;

    if (cible !== null)
        document.getElementById("cible").value = cible;

    if (amp !== null)
        document.getElementById("amp").value = amp;

    if (phase !== null)
        document.getElementById("phase").value = phase;
}

/* ==================================
   BOUTONS + / -
================================== */

function changeValue(id, delta) {

    const el =
        document.getElementById(id);

    let valeur =
        parseInt(el.value) + delta;

    valeur = Math.max(
        parseInt(el.min),
        valeur
    );

    valeur = Math.min(
        parseInt(el.max),
        valeur
    );

    el.value = valeur;

    update();
}

/* ==================================
   PHASE
================================== */

function setPhase(mode) {

    document.getElementById(
        "phase"
    ).value = mode;

    document
        .querySelectorAll(".phase-btn")
        .forEach(btn => {

            btn.classList.remove(
                "selected"
            );

        });

    if (mode === "mono") {

        document
            .querySelectorAll(".phase-btn")[0]
            .classList.add("selected");

    } else {

        document
            .querySelectorAll(".phase-btn")[1]
            .classList.add("selected");
    }

    update();
}

/* ==================================
   AMPERAGE
================================== */

function setAmp(valeur) {

    if (
        !AMPERAGES.includes(valeur)
    ) {

        valeur = 10;
    }

    document.getElementById(
        "amp"
    ).value = valeur;

    document
        .querySelectorAll(".amp-btn")
        .forEach(btn => {

            btn.classList.remove(
                "selected"
            );

        });

    document
        .querySelectorAll(".amp-btn")
        .forEach(btn => {

            if (
                btn.textContent.trim() ===
                valeur + "A"
            ) {

                btn.classList.add(
                    "selected"
                );
            }

        });

    update();
}

/* ==================================
   CALCUL
================================== */

function update() {

    let capacite =
        parseFloat(
            document.getElementById(
                "capacite"
            ).value
        );

    if (isNaN(capacite)) {

        capacite = 45;
    }

    const actuel =
        parseInt(
            document.getElementById(
                "actuel"
            ).value
        ) || 0;

    const cible =
        parseInt(
            document.getElementById(
                "cible"
            ).value
        ) || 0;

    const amp =
        parseInt(
            document.getElementById(
                "amp"
            ).value
        ) || 10;

    const phase =
        document.getElementById(
            "phase"
        ).value || "tri";

    document.getElementById(
        "actuelValue"
    ).textContent =
        actuel + "%";

    document.getElementById(
        "cibleValue"
    ).textContent =
        cible + "%";

    const batteryInfo =
        document.getElementById(
            "batteryInfo"
        );

    if (batteryInfo) {

        batteryInfo.classList.remove(
            "warning",
            "error"
        );

        if (capacite < 10) {

            batteryInfo.textContent =
                "⚠️ Batterie inhabituellement faible";

            batteryInfo.classList.add(
                "warning"
            );

        } else if (capacite > 150) {

            batteryInfo.textContent =
                "⚠️ Batterie inhabituellement élevée";

            batteryInfo.classList.add(
                "warning"
            );

        } else {

            batteryInfo.textContent =
                capacite + " kWh";
        }
    }

    if (cible <= actuel) {

        document.getElementById(
            "temps"
        ).textContent =
            "0 h 00 min";

        document.getElementById(
            "etat"
        ).textContent =
            "✅ Niveau atteint";

        sauvegarder();

        return;
    }

    const energie =

        ((cible - actuel)
        * capacite)
        / 100;

    let puissance = 0;

    if (phase === "mono") {

        puissance =
            (230 * amp)
            / 1000;

    } else {

        puissance =
            (1.732 * 400 * amp)
            / 1000;
    }

    const heures =
        energie / puissance;

    let h =
        Math.floor(
            heures
        );

    let min =
        Math.round(
            (heures - h)
            * 60
        );

    if (min >= 60) {

        h++;
        min = 0;
    }

    document.getElementById(
        "temps"
    ).textContent =

        h +
        " h " +
        String(min)
            .padStart(
                2,
                "0"
            ) +
        " min";

    let etat = "";

    if (puissance < 4) {

        etat =
            "🟢 Charge lente";

    } else if (
        puissance < 11
    ) {

        etat =
            "🟡 Charge accélérée";

    } else {

        etat =
            "⚡ Charge rapide AC";
    }

    document.getElementById(
        "etat"
    ).textContent =
        etat;

    sauvegarder();
}

/* ==================================
   INITIALISATION
================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        chargerPreferences();

        let ampSauvegarde =
            parseInt(
                document.getElementById(
                    "amp"
                ).value
            );

        if (
            !AMPERAGES.includes(
                ampSauvegarde
            )
        ) {

            ampSauvegarde = 10;
        }

        setAmp(
            ampSauvegarde
        );

        const phaseSauvegardee =
            document.getElementById(
                "phase"
            ).value || "tri";

        setPhase(
            phaseSauvegardee
        );

    }
);

/* ==================================
   SERVICE WORKER
================================== */

if (
    "serviceWorker" in navigator
) {

    window.addEventListener(
        "load",
        async () => {

            try {

                await navigator
                    .serviceWorker
                    .register(
                        "./service-worker.js"
                    );

            } catch (error) {

                console.error(
                    error
                );

            }

        }
    );
}
