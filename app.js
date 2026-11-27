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

    localStorage.setItem(
        "capacite",
        document.getElementById("capacite").value
    );

    localStorage.setItem(
        "puissanceMax",
        document.getElementById("puissanceMax").value
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

        if (
            valeur !== null &&
            document.getElementById(id)
        ) {

            document.getElementById(id).value =
                valeur;
        }

    });

}

/* ==================================
   +/- %
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
        .forEach(btn =>
            btn.classList.remove(
                "selected"
            )
        );

    if (mode === "mono") {

        document
            .querySelectorAll(".phase-btn")[0]
            .classList.add(
                "selected"
            );

    } else {

        document
            .querySelectorAll(".phase-btn")[1]
            .classList.add(
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

        valeur = 10;
    }

    document.getElementById(
        "amp"
    ).value = valeur;

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

/* ==================================
   CALCUL
================================== */

function update() {

    const capacite =
        parseFloat(
            document.getElementById(
                "capacite"
            ).value
        ) || 45;

    const puissanceMaxVehicule =
        parseFloat(
            document.getElementById(
                "puissanceMax"
            ).value
        ) || 22;

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
        ) || 8;

    const phase =
        document.getElementById(
            "phase"
        ).value || "tri";

    document.getElementById(
        "actuelValue"
    ).textContent =
  
