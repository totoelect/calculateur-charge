/* ====================================
   VALEURS AUTORISÉES
==================================== */

const AMPERAGES = [8, 10, 12, 14, 16];

/* ====================================
   SAUVEGARDE
==================================== */

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
}

/* ====================================
   CHARGEMENT
==================================== */

function chargerPreferences() {

    const capacite =
        localStorage.getItem("capacite");

    const actuel =
        localStorage.getItem("actuel");

    const cible =
        localStorage.getItem("cible");

    const amp =
        localStorage.getItem("amp");

    if (capacite !== null) {

        document.getElementById(
            "capacite"
        ).value = capacite;
    }

    if (actuel !== null) {

        document.getElementById(
            "actuel"
        ).value = actuel;
    }

    if (cible !== null) {

        document.getElementById(
            "cible"
        ).value = cible;
    }

    if (amp !== null) {

        document.getElementById(
            "amp"
        ).value = amp;
    }
}

/* ====================================
   BOUTONS + -
==================================== */

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

/* ====================================
   AMPERAGE
==================================== */

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
                btn.textContent.trim()
                === valeur + "A"
            ) {

                btn.classList.add(
                    "selected"
                );
            }

        });

    update();
}

/* ====================================
   CALCUL PRINCIPAL
==================================== */

function update() {

    const capacite =
        parseFloat(
            document.getElementById(
                "capacite"
            ).value
        ) || 45;

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

    document.getElementById(
        "actuelValue"
    ).textContent =
        actuel + "%";

    document.getElementById(
        "cibleValue"
    ).textContent =
        cible + "%";

    document.getElementById(
        "ampValue"
    ).textContent =
        amp + " A";

    if (capacite <= 0) {

        document.getElementById(
            "temps"
        ).textContent = "--";

        document.getElementById(
            "etat"
        ).textContent = "⚠️";

        return;
    }

    if (cible <= actuel) {

        document.getElementById(
            "temps"
        ).textContent =
            "0 h 00 min";

        document.getElementById(
            "etat"
        ).textContent =
            "✅";

        sauvegarder();

        return;
    }

    const energie =

        ((cible - actuel)
        * capacite)
        / 100;

    const puissance =

        0.69 * amp;

    const heures =

        energie / puissance;

    let h =
        Math.floor(heures);

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
        .padStart(2, "0") +
        " min";

    let etat = "";

    if (amp <= 10) {

        etat =
            "🟢 Charge lente";

    } else {

        etat =
            "🟡 Charge normale";
    }

    document.getElementById(
        "etat"
    ).textContent =
        etat;

    sauvegarder();
}

/* ====================================
   INITIALISATION
==================================== */

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

    }
);

/* ====================================
   SERVICE WORKER
==================================== */

if (
    "serviceWorker"
    in navigator
) {

    window.addEventListener(
        "load",
        async () => {

            try {

                const registration =
                    await navigator
                    .serviceWorker
                    .register(
                        "./service-worker.js"
                    );

                console.log(
                    "SW OK",
                    registration.scope
                );

            } catch (error) {

                console.error(
                    "SW KO",
                    error
                );

            }

        }
    );
}
