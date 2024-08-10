function openAccordionMenu(id, display, arrowId = null) {
    let div = document.getElementById(id);
    if (div.style.display == display) {
        div.style.display = "none";
    } else {
        div.style.display = display;
    }
    if (arrowId != null) {
        let rotation =
            div.style.display == display ? "rotate(180deg)" : "rotate(0)";
        document.getElementById(arrowId).style.transform = rotation;
    }
}

function closeAccordionMenu(id) {
    let div = document.getElementById(id);
    div.style.display = "none";
}

function openTab(id, display) {
    let div = document.getElementById(id);
    div.style.display = display;
}

function closeTab(id) {
    let div = document.getElementById(id);
    div.style.display = "none";
}