/* ==================================
   CONFIGURATION
================================== */

const AMPERAGES = [
    8, 10, 12, 14,
    16, 20, 25, 32
];

const RENDEMENT = 0.90;

/* ==================================
   SAUVEGARDE
================================== */

function sauvegarder() {

    const ids = [
        "capacite",
        "puissanceMax",
        "actuel",
        "cible",
        "amp",
        "phase"
    ];

    ids.forEach(id => {

        const el =
            document.getElementById(id);

        if (el) {

            localStorage.setItem(
                id,
                el.value
            );
        }

    });
}

/* ==================================
   CHARGEMENT
================================== */

function chargerPreferences() {

    const ids = [
        "capacite",
        "puissanceMax",
        "actuel",
        "cible",
        "amp",
        "phase"
    ];

    ids.forEach(id => {

        const valeur =
            localStorage.getItem(id);

        const element =
            document.getElementById(id);

        if (
            valeur !== null &&
            element
        ) {

            element.value = valeur;
        }

    });
}

/* ==================================
   BOUTONS %
================================== */

function changeValue(id, delta) {

    const el =
        document.getElementById(id);

    if (!el) return;

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

    const phase =
        document.getElementById(
            "phase"
        );

    if (!phase) return;

    phase.value = mode;

    document
        .querySelectorAll(".phase-btn")
        .forEach(btn =>
            btn.classList.remove(
                "selected"
            )
        );

    if (mode === "mono") {

        document
            .querySelectorAll(".phase-btn")[0]
            ?.classList.add(
                "selected"
            );

    } else {

        document
            .querySelectorAll(".phase-btn")[1]
            ?.classList.add(
                "selected"
            );
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

        valeur = 8;
    }

    const amp =
        document.getElementById(
            "amp"
        );

    if (!amp) return;

    amp.value = valeur;

    document
        .querySelectorAll(".amp-btn")
        .forEach(btn =>
            btn.classList.remove(
                "selected"
            )
        );

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

    const capacite =
        parseFloat(
            document.getElementById(
                "capacite"
            )?.value
        ) || 45;

    const puissanceMaxVehicule =
        parseFloat(
            document.getElementById(
                "puissanceMax"
            )?.value
        ) || 11;

    const actuel =
        parseInt(
            document.getElementById(
                "actuel"
            )?.value
        ) || 0;

    const cible =
        parseInt(
            document.getElementById(
                "cible"
            )?.value
        ) || 0;

    const amp =
        parseInt(
            document.getElementById(
                "amp"
            )?.value
        ) || 8;

    const phase =
        document.getElementById(
            "phase"
        )?.value || "tri";

    const actuelValue =
        document.getElementById(
            "actuelValue"
        );

    const cibleValue =
        document.getElementById(
            "cibleValue"
        );

    if (actuelValue) {

        actuelValue.textContent =
            actuel + "%";
    }

    if (cibleValue) {

        cibleValue.textContent =
            cible + "%";
    }

    if (cible <= actuel) {

        document.getElementById(
            "temps"
        ).textContent =
            "0 h 00 min";

        document.getElementById(
            "energie"
        ).textContent =
            "Énergie chargée : 0,0 kWh";

        document.getElementById(
            "puissance"
        ).textContent =
            "Puissance utilisée : 0,0 kW";

        document.getElementById(
            "etat"
        ).textContent =
            "✅ Niveau atteint";

        return;
    }

    const energie =

        ((cible - actuel)
        * capacite)
        / 100;

    let puissanceInstallation = 0;

    if (phase === "mono") {

        puissanceInstallation =
            ((230 * amp) / 1000)
            * RENDEMENT;

    } else {

        puissanceInstallation =
            ((1.732 * 400 * amp) / 1000)
            * RENDEMENT;
    }

    const puissanceUtilisee =

        Math.min(
            puissanceInstallation,
            puissanceMaxVehicule
        );

    const heures =

        energie /
        puissanceUtilisee;

    let h =
        Math.floor(
            heures
        );

    let min =
        Math.round(
            (heures - h) * 60
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

    document.getElementById(
        "energie"
    ).textContent =

        "Énergie chargée : " +

        energie
            .toFixed(1)
            .replace(".", ",")

        + " kWh";

    document.getElementById(
        "puissance"
    ).textContent =

        "Puissance utilisée : " +

        puissanceUtilisee
            .toFixed(1)
            .replace(".", ",")

        + " kW";

    document.getElementById(
        "puissanceInstallation"
    ).textContent =

        "Installation : " +

        puissanceInstallation
            .toFixed(1)
            .replace(".", ",")

        + " kW";

    document.getElementById(
        "puissanceVehicule"
    ).textContent =

        "Véhicule : " +

        puissanceMaxVehicule
            .toFixed(1)
            .replace(".", ",")

        + " kW max";

    document.getElementById(
        "puissanceReelle"
    ).textContent =

        "Puissance utilisée : " +

        puissanceUtilisee
            .toFixed(1)
            .replace(".", ",")

        + " kW";

    let etat = "";

    if (puissanceUtilisee < 4) {

        etat =
            "🟢 Charge lente";

    }
    else if (
        puissanceUtilisee < 11
    ) {

        etat =
            "🟡 Charge accélérée";

    }
    else {

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

        setAmp(
            parseInt(
                document.getElementById(
                    "amp"
                )?.value
            ) || 8
        );

        setPhase(
            document.getElementById(
                "phase"
            )?.value || "tri"
        );

        update();
    }
);

/* ==================================
   SERVICE WORKER
================================== */

if (
    "serviceWorker"
    in navigator
) {

    window.addEventListener(
        "load",
        async () => {

            try {

                await navigator
                    .serviceWorker
                    .register(
                        "service-worker.js"
                    );

            } catch (error) {

                console.error(
                    error
                );
            }

        }
    );
}
