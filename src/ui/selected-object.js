import { Editor } from "../editor/editor.js";

function updateSelectedCircuitObjectUI() {
    const div = document.getElementById("selecting-circuit-object-container");
    for (let i = 0, len = div.children.length; i < len; ++i) {
        div.children[i].style.display = "none";
    }
    // console.log(Editor.selectedCircuitObject)
    if (Editor.selectedCircuitObject) {
        let name = Editor.selectedCircuitObject.name;
        if (name != null) {
            div.style.display = "flex";
            document.getElementById("selecting-name").style.display = "flex";
            document.getElementById("selecting-name").innerText = name;
            Editor.selectedCircuitObject.selected();
        } else {
            div.style.display = "none";
        }
    }
}

export { updateSelectedCircuitObjectUI }