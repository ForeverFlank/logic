import * as Gates from "./gates/gates.js"

let buttons = {
    "gate-io": [
        ["Input", () => Gates.Input.add()],
        ["Output", () => Gates.Output.add()],
        ["N-bit Input", () => Gates.NBit.NBitInput.add()],
        // ["LED", () => Gates.IO.LED.add()],
    ],
    "gate-basic": [
        ["NOT", () => Gates.Basic.NotGate.add()],
        ["Tri-State Buffer", () => Gates.Basic.TriStateBuffer.add()],
        ["AND", () => Gates.Basic.AndGate.add()],
        ["NAND", () => Gates.Basic.NandGate.add()],
        ["OR", () => Gates.Basic.OrGate.add()],
        ["NOR", () => Gates.Basic.NorGate.add()],
        ["XOR", () => Gates.Basic.XorGate.add()],
        ["XNOR", () => Gates.Basic.XnorGate.add()],
    ],
    "gate-plexers": [
        ["1-to-2 Decoder", () => Gates.Plexers.Decoder1To2.add()],
        ["2-to-4 Decoder", () => Gates.Plexers.Decoder2To4.add()],
        ["3-to-8 Decoder", () => Gates.Plexers.Decoder3To8.add()],
    ],
    "gate-latches": [
        ["SR Latch", () => Gates.Latches.SRLatch.add()],
        ["D Latch", () => Gates.Latches.DLatch.add()],
        ["D Flip Flop", () => Gates.Latches.DFlipFlop.add()],
        ["T Flip Flop", () => Gates.Latches.TFlipFlop.add()],
        ["JK Flip Flop", () => Gates.Latches.JKFlipFlop.add()],
        ["Register", () => Gates.Latches.Register.add()],
    ],
    "gate-arithmetic": [
        ["Half Adder", () => Gates.Basic.HalfAdder.add()],
        ["Full Adder", () => Gates.Basic.FullAdder.add()],
        ["N-bit Adder", () => Gates.NBit.NBitAdder.add()],
    ],
    "gate-nbit": [
        ["N-bit Input", () => Gates.NBit.NBitInput.add()],
        ["Splitter", () => Gates.NBit.openSplitterMenu()],
        ["Bitwise NOT", () => Gates.NBit.BitwiseNotGate.add()],
        ["N-bit Tri-State Buffer", () => Gates.NBit.NBitTriStateBuffer.add()],
        ["Bitwise AND", () => Gates.NBit.BitwiseAndGate.add()],
        ["Bitwise OR", () => Gates.NBit.BitwiseOrGate.add()],
        ["N-bit Multiplexer", () => Gates.NBit.NBitMultiplexer.add()],
        ["N-bit Adder", () => Gates.NBit.NBitAdder.add()],
    ],
};

export function createGateMenuButtons() {
    for (let container in buttons) {
        let div = document.getElementById(container);
        buttons[container].forEach(([title, onClick]) => {
            const button = document.createElement("button");
            button.textContent = title;
            button.onclick = onClick;
            div.appendChild(button);
        });
    }
}
