/* ==========================
   SAUVEGARDE
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
   CHARGEMENT
========================== */

function chargerPreferences() {

    const capacite =
        localStorage.getItem("capacite");

    const actuel =
        localStorage.getItem("actuel");

    const cible =
        localStorage.getItem("cible");

    const amp =
        localStorage.getItem("amp");

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
   NIVEAUX %
========================== */

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

/* ==========================
   AMPERAGE
========================== */

function setAmp(valeur) {

    document
        .getElementById("amp")
        .value = valeur;

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

            const texte =
                btn.textContent.trim();

            if (texte === valeur + "A") {

                btn.classList.add(
                    "selected"
                );
            }
        });

    update();
}

/* ==========================
   CALCUL
========================== */

function update() {

    const capacite =
        parseFloat(
            document.getElementById(
                "capacite"
            ).value
        ) || 46;

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

    const ampValue =
        document.getElementById(
            "ampValue"
        );

    if (ampValue) {

        ampValue.textContent =
            amp + " A";
    }

    if (capacite <= 0) {

        document.getElementById(
            "temps"
        ).textContent =
            "--";

        document.getElementById(
            "etat"
        ).textContent =
            "⚠️ Capacité invalide";

        return;
    }

    if (cible <= actuel) {

        document.getElementById
