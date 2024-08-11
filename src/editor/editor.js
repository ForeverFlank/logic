import { EventHandler, updatePointerPosition } from "../event/event-handler.js";
import * as Constants from "../constants.js"
import { CanvasContainer } from "../classes/canvas.js";
import { currentCircuit, mainCanvasContainer, mainContainer } from "../main.js";
import { updateSelectedCircuitObjectUI } from "../ui/selected-object.js";


class Editor {
    constructor() { }

    static mode = "edit";
    static wireDraggingEnabled = false;
    static divIds = [
        "top-tab",
        "gate-menu",
        "selecting-circuit-object-container",
        "control-tab",
        "learn-container"
    ];
    static blurDiv = document.getElementById("background-blur");

    static container = null;
    static zoom = 1;
    static position = { x: 0, y: 0 }
    static pointerPosition = { x: 0, y: 0 };
    static centerPosition = { x: 0, y: 0 };
    static panEnabled = false;

    static pressedCircuitObject = { id: 0 };
    static pressedWire = { id: 0 };
    static pressedNode = null;
    static wireDrawingGraphics = null;

    static circuitPointerDown(e) {
        let isPressedOnCircuit = false;
        for (let i = currentCircuit.modules.length - 1; i >= 0; i--) {
            let mod = currentCircuit.modules[i];
            let nodes = mod.inputs.concat(mod.outputs); // TODO: remove concat for better performance
            for (let j = nodes.length - 1; j >= 0; j--) {
                if (nodes[j].pressed(e, false)) {
                    isPressedOnCircuit = true;
                    break;
                }
                let wires = nodes[j].connections;
                for (let k = wires.length - 1; k >= 0; k--) {
                    if (wires[k].pressed(e)) {
                        isPressedOnCircuit = true;
                        break;
                    }
                }
            }
            if (mod.pressed(e)) {
                isPressedOnCircuit = true;
                break;
            }
        }
        if (isPressedOnCircuit) {
            Editor.selectedCircuitObject = Editor.pressedCircuitObject;
        }
        updateSelectedCircuitObjectUI();
        return isPressedOnCircuit;
    }
    static circuitPointerMove(e) {
        for (let i = currentCircuit.modules.length - 1; i >= 0; i--) {
            let mod = currentCircuit.modules[i];
            let nodes = mod.inputs.concat(mod.outputs);
            mod.onPointerMove(e);
            for (let j = nodes.length - 1; j >= 0; j--) {
                // nodes[j].onPointerMove(e);
                let wires = nodes[j].connections;
                for (let k = wires.length - 1; k >= 0; k--) {
                    // wires[k].released(e)
                }
            }
        }
    }
    static circuitPointerUp(e) {
        let releasedOnNode = false;
        for (let i = currentCircuit.modules.length - 1; i >= 0; i--) {
            let mod = currentCircuit.modules[i];
            let nodes = mod.inputs.concat(mod.outputs);
            mod.released(e);
            mod.isHovering = false;
            for (let j = nodes.length - 1; j >= 0; j--) {
                releasedOnNode |= nodes[j].released(e, false)
                let wires = nodes[j].connections;
                for (let k = wires.length - 1; k >= 0; k--) {
                    // wires[k].released(e)
                }
            }
        }
        if (!releasedOnNode) {
            if (Editor.pressedNode) {
                Editor.pressedNode.addWireNode();
            }
        }
        Editor.pressedCircuitObject = { id: 0 };
        Editor.pressedWire = { id: 0 };
        Editor.pressedNode = null;
    }
    static isPointerHoveringOnDiv(e) {
        for (let i in this.divIds) {
            let div = document.getElementById(this.divIds[i]);
            let offsets = div.getBoundingClientRect();
            const top = offsets.top;
            const left = offsets.left;
            const height = div.clientHeight;
            const width = div.clientWidth;
            if (
                EventHandler.pointerPosition.y > top &&
                EventHandler.pointerPosition.y < top + height &&
                EventHandler.pointerPosition.x > left &&
                EventHandler.pointerPosition.x < left + width
            ) {
                return true;
            }
        }
        if (Editor.blurDiv.style.display != "none") return true;
        return false;
    }
    static updateViewport() {
        Editor.container.x = Editor.position.x;
        Editor.container.y = Editor.position.y;
        Editor.container.scale.x = Editor.zoom;
        Editor.container.scale.y = Editor.zoom;
    }
}

function updateEditorPointerPosition(e) {
    updatePointerPosition(e);
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;
    Editor.pointerPosition.x = (EventHandler.pointerPosition.x - Editor.position.x) / Editor.zoom;
    Editor.pointerPosition.y = (EventHandler.pointerPosition.y - Editor.position.y) / Editor.zoom;
    Editor.centerPosition.x = (width / 2 - Editor.position.x) / Editor.zoom;
    Editor.centerPosition.y = (height / 2 - Editor.position.y) / Editor.zoom;
}

function editorPointerDown(e) {
    // console.log(e)
    // console.log(Editor.mode)
    updateEditorPointerPosition(e);
    console.log('down', EventHandler.pointerPosition.x, EventHandler.pointerPosition.y)
    if (Editor.mode == "edit") {
        if (Editor.isPointerHoveringOnDiv(e)) return;
        let isPressedOnCircuit = Editor.circuitPointerDown(e);
        if (!isPressedOnCircuit) {
            Editor.selectedCircuitObject = { id: 0 };
            Editor.panEnabled = true;
        }
    } else if (Editor.mode == "pan") {
        Editor.panEnabled = true;
    } else if (Editor.mode == "delete") {
        Editor.circuitPointerDown(e);
        if (Editor.pressedCircuitObject.id != 0) {
            Editor.pressedCircuitObject.remove();
        }
        if (Editor.pressedWire.id != 0) {
            Editor.pressedWire.remove();
        }
        Editor.selectedCircuitObject = { id: 0 };
    }
    updateSelectedCircuitObjectUI();
}

EventHandler.add("pointerdown", editorPointerDown);
// EventHandler.add("touchstart", editorPointerDown);

function editorPointerMove(e) {
    // console.log('move', EventHandler.pointerPosition.x, EventHandler.pointerPosition.y)

    updateEditorPointerPosition(e);
    /*
    placeX = -controls.view.x / controls.view.zoom;
    placeY = -controls.view.y / controls.view.zoom;
    placeX = Math.round(placeX / 20) * 20;
    placeY = Math.round(placeY / 20) * 20;
    */
    Editor.circuitPointerMove(e)
    if (Editor.panEnabled) {
        // console.log(EventHandler.deltaPointerPosition)
        Editor.position.x += EventHandler.deltaPointerPosition.x;
        Editor.position.y += EventHandler.deltaPointerPosition.y;
        Editor.updateViewport();
    }

    for (let i = currentCircuit.modules.length - 1; i >= 0; i--) {
        let mod = currentCircuit.modules[i];
        let nodes = mod.inputs.concat(mod.outputs);
        mod.hovering(e);
        for (let j = nodes.length - 1; j >= 0; j--) {
            nodes[j].hovering(e);
            let wires = nodes[j].connections;
            for (let k = wires.length - 1; k >= 0; k--) {
                wires[k].hovering(e);
            }
        }
    }

}

let touched = false;
/*
EventHandler.add("touchdrag", (e) => {
    editorPointerMove(e);
    touched = true;
    // console.log("TOUCH")
});
*/
EventHandler.add("pointermove", (e) => {
    // console.log(touched)
    editorPointerMove(e)
});

function editorPointerUp(e) {
    // console.log("up", EventHandler.pointerPosition.x, EventHandler.pointerPosition.y);
    updateEditorPointerPosition(e);
    Editor.circuitPointerUp(e);
    Editor.panEnabled = false;
}

EventHandler.add("pointerup", editorPointerUp);
// EventHandler.add("touchend", editorPointerUp);

EventHandler.add("wheel",
    function viewportPanZoom(e) {
        if (Editor.isPointerHoveringOnDiv(e)) return;
        const zoomFactor = 0.1;
        const zoomDirection = e.deltaY < 0 ? 1 : -1;
        const zoom = zoomFactor * zoomDirection * Editor.zoom;
        const zoomAmount = 1 + zoom / Editor.zoom;
        const width = mainCanvasContainer.getContainerWidth();
        const height = mainCanvasContainer.getContainerHeight();
        let dx = EventHandler.pointerPosition.x - Editor.position.x;
        let dy = EventHandler.pointerPosition.y - Editor.position.y;
        dx *= zoomAmount;
        dy *= zoomAmount;
        Editor.zoom += zoom;
        if (Editor.zoom < 0.2) Editor.zoom = 0.2;
        else if (Editor.zoom > 5) Editor.zoom = 5;
        else {
            Editor.position.x = EventHandler.pointerPosition - dx;
            Editor.position.y = EventHandler.pointerPosition.y - dy;
        }
        Editor.updateViewport();
    }
);

export { Editor }