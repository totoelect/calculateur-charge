/* ==========================
   SAUVEGARDE LOCALE
========================== */

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

/* ==========================
   CHARGEMENT DES DONNÉES
========================== */

function chargerPreferences() {

    const capacite = localStorage.getItem("capacite");
    const actuel = localStorage.getItem("actuel");
    const cible = localStorage.getItem("cible");
    const amp = localStorage.getItem("amp");

    if (capacite !== null)
        document.getElementById("capacite").value = capacite;

    if (actuel !== null)
        document.getElementById("actuel").value = actuel;

    if (cible !== null)
        document.getElementById("cible").value = cible;

    if (amp !== null)
        document.getElementById("amp").value = amp;
}

/* ==========================
   BOUTONS + / -
========================== */

function changeValue(id, delta) {

    const el = document.getElementById(id);

    let valeur = parseInt(el.value) + delta;

    valeur = Math.max(parseInt(el.min), valeur);
    valeur = Math.min(parseInt(el.max), valeur);

    el.value = valeur;

    update();
}

/* ==========================
   CALCUL PRINCIPAL
========================== */

function update() {

    const capacite =
        parseFloat(
            document.getElementById("capacite").value
        ) || 46;

    const actuel =
        parseInt(
            document.getElementById("actuel").value
        ) || 0;

    const cible =
        parseInt(
            document.getElementById("cible").value
        ) || 0;

    const amp =
        parseInt(
            document.getElementById("amp").value
        ) || 6;

    document.getElementById("actuelValue").textContent =
        actuel + "%";

    document.getElementById("cibleValue").textContent =
        cible + "%";

    document.getElementById("ampValue").textContent =
        amp + " A";

    /* Vérifications */

    if (capacite <= 0) {

        document.getElementById("temps").textContent =
            "--";

        document.getElementById("etat").textContent =
            "⚠ Capacité invalide";

        return;
    }

    if (cible <= actuel) {

        document.getElementById("temps").textContent =
            "0 h 00 min";

        document.getElementById("etat").textContent =
            "✅ Niveau déjà atteint";

        sauvegarder();
        return;
    }

    /* Calcul énergie */

    const energie =
        ((cible - actuel) * capacite) / 100;

    /* Calcul puissance */

    const puissance =
        0.69 * amp;

    /* Calcul temps */

    const heures =
        energie / puissance;

    let h =
        Math.floor(heures);

    let min =
        Math.round(
            (heures - h) * 60
        );

    /* Correction du cas 60 minutes */

    if (min === 60) {

        h++;

        min = 0;
    }

    document.getElementById("temps").textContent =
        h +
        " h " +
        String(min).padStart(2, "0") +
        " min";

    /* Etat de charge */

    let etat = "";

    if (amp <= 10) {

        etat = "🟢 Charge lente";

    } else if (amp <= 16) {

        etat = "🟡 Charge normale";

    } else {

        etat = "🔴 Charge rapide";
    }

    document.getElementById("etat").textContent =
        etat;

    sauvegarder();
}

/* ==========================
   DEMARRAGE
========================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        chargerPreferences();

        update();
    }
);

/* ==========================
   SERVICE WORKER
========================== */

if ("serviceWorker" in navigator) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register("service-worker.js")
                .then(() => {

                    console.log(
                        "Service Worker enregistré"
                    );

                })
                .catch(error => {

                    console.error(error);

                });
        }
    );
}
