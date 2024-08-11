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

// temporary ---------------
function pushAlert(level, message) {
    let container = document.getElementById("alert-container");
    let element;
    if (level == "error") {
        element = document.getElementById("alert-error");
    } else if (level == "info") {
        element = document.getElementById("alert-info");
    } else {
        return false;
    }
    let clone = element.cloneNode(true);
    clone.innerText = message;
    clone.style.display = "block";
    container.appendChild(clone);

    setTimeout(() => {
        clone.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: 1000,
        });
    }, 3000);

    setTimeout(() => {
        clone.remove();
    }, 4000);
}

const bg = document.getElementById("background-blur");
const modalMenu = document.getElementById("modal-menu");
const modalTitle = document.getElementById("modal-title");
const modalContainer = document.getElementById("modal-container");

function openModalMenu(title, html) {
    modalTitle.innerText = title;
    modalContainer.innerHTML = html;
    modalMenu.style.display = "flex";
    bg.style.display = "block";
}

function closeModalMenu() {
    modalMenu.style.display = "none";
    bg.style.display = "none";
}