function changeValue(id, delta){

    const el = document.getElementById(id);

    let value = parseInt(el.value) + delta;

    value = Math.max(parseInt(el.min), value);
    value = Math.min(parseInt(el.max), value);

    el.value = value;

    update();
}

function update(){

    const capacite =
        parseFloat(document.getElementById("capacite").value);

    const actuel =
        parseInt(document.getElementById("actuel").value);

    const cible =
        parseInt(document.getElementById("cible").value);

    const amp =
        parseInt(document.getElementById("amp").value);

    document.getElementById("actuelValue").innerHTML =
        actuel + "%";

    document.getElementById("cibleValue").innerHTML =
        cible + "%";

    document.getElementById("ampValue").innerHTML =
        amp + " A";

    const energie =
        ((cible - actuel) * capacite) / 100;

    const puissance =
        0.69 * amp;

    const heures =
        energie / puissance;

    const h =
        Math.floor(heures);

    const min =
        Math.round((heures - h) * 60);

    document.getElementById("temps").innerHTML =
        h + " h " + min + " min";

    let etat = "🟢 Charge lente";

    if(amp > 10)
        etat = "🟡 Charge normale";

    if(amp > 16)
        etat = "🔴 Charge rapide";

    document.getElementById("etat").innerHTML = etat;
}

update();

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
}