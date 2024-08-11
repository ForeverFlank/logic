import { Module, WireNode } from "../classes/module.js";
import { ModuleNode, InputNode, OutputNode, SplitterNode } from "../classes/modulenode.js";
import { State } from "../classes/state.js";

class SRLatch extends Module {
    constructor(obj) {
        if (obj.width == null) obj.width = 4;
        if (obj.height == null) obj.height = 4;
        super(obj);
        this.inputs = [
            new InputNode(this, "Set", 0, 1),
            new InputNode(this, "Reset", 0, 3),
        ];
        this.outputs = [
            new OutputNode(this, "Q", 4, 1),
            new OutputNode(this, "Q'", 4, 3),
        ];
        this.inputs.forEach((node) => (node.pinDirection = 0));
        this.outputs.forEach((node) => (node.pinDirection = 2));
        this.displayName = "S";
        this.latchValue = State.low;
    }
    render(obj) {
        obj.labels = [
            ["S", 12, -25, -20, 2],
            ["R", 12, -25, 20, 2],
            ["Q", 12, 25, -20, 0],
            ["Q'", 12, 25, 20, 0],
        ];
        super.render(obj);
    }
    init() {
        super.init();
        this.latchValue = State.low;
    }
    evaluate(time) {
        super.evaluate(time);
        let s = this.inputs[0].getValueAtTime(time)[0];
        let r = this.inputs[1].getValueAtTime(time)[0];
        if (this.latchValue == State.low && s == State.high) {
            this.latchValue = State.high;
        }
        if (this.latchValue == State.high && r == State.high) {
            this.latchValue = State.low;
        }
        this.outputs[0].setValue(
            this.latchValue,
            0,
            time + this.outputs[0].delay,
            false,
            true
        );
        this.outputs[1].setValue(
            State.not(this.latchValue),
            0,
            time + this.outputs[1].delay,
            false,
            true
        );
    }
    static add() {
        Module.addToCircuit(new SRLatch({ name: "SR Latch" }));
    }
}

class DLatch extends Module {
    constructor(obj) {
        if (obj.width == null) obj.width = 4;
        if (obj.height == null) obj.height = 4;
        super(obj);
        this.inputs = [
            new InputNode(this, "Data", 0, 1),
            new InputNode(this, "Enable", 0, 3),
        ];
        this.outputs = [
            new OutputNode(this, "Q", 4, 1),
            new OutputNode(this, "Q'", 4, 3),
        ];
        this.inputs.forEach((node) => (node.pinDirection = 0));
        this.outputs.forEach((node) => (node.pinDirection = 2));
        this.displayName = "";
        this.latchValue = State.low;
    }
    render(obj) {
        obj.labels = [
            ["D", 12, -25, -20, 2],
            ["EN", 12, -25, 20, 2],
            ["Q", 12, 25, -20, 0],
            ["Q'", 12, 25, 20, 0],
        ]
        super.render(obj);
    }
    init() {
        super.init();
        this.latchValue = State.low;
    }
    evaluate(time) {
        super.evaluate(time);
        let d = this.inputs[0].getValueAtTime(time)[0];
        let e = this.inputs[1].getValueAtTime(time)[0];
        if (e == State.high) {
            if (d == State.low || d == State.high) {
                this.latchValue = d;
            } else {
                this.latchValue = State.err;
            }
        }
        this.outputs[0].setValue(
            this.latchValue,
            0,
            time + this.outputs[0].delay,
            false,
            true
        );
        this.outputs[1].setValue(
            State.not(this.latchValue),
            0,
            time + this.outputs[1].delay,
            false,
            true
        );
    }
    static add() {
        Module.addToCircuit(new DLatch({ name: "D Latch" }));
    }
}

class DFlipFlop extends Module {
    constructor(obj) {
        if (obj.width == null) obj.width = 4;
        if (obj.height == null) obj.height = 4;
        super(obj);
        this.inputs = [
            new InputNode(this, "Data", 0, 1),
            new InputNode(this, "Clock", 0, 2),
        ];
        this.outputs = [
            new OutputNode(this, "Q", 4, 1),
            new OutputNode(this, "Q'", 4, 3),
        ];
        this.inputs.forEach((node) => (node.pinDirection = 0));
        this.outputs.forEach((node) => (node.pinDirection = 2));
        this.displayName = "";
        this.latchValue = State.low;
        this.previousClk = State.low;
    }
    render(obj) {
        obj.labels = [
            ["D", 12, -25, -20, 2],
            [">", 24, -24, 0],
            ["Q", 12, 25, -20, 0],
            ["Q'", 12, 25, 20, 0],
        ];
        super.render(obj);
    }
    init() {
        super.init();
        this.latchValue = State.low;
        this.previousClk = State.low;
    }
    evaluate(time) {
        super.evaluate(time);
        let d = this.inputs[0].getValueAtTime(time)[0];
        let clk = this.previousClk;
        this.previousClk = this.inputs[1].getValueAtTime(time)[0];
        let rising = this.previousClk != clk && this.previousClk == State.high;
        if (rising) {
            if (d == State.low || d == State.high) {
                this.latchValue = d;
            } else {
                this.latchValue = State.err;
            }
        }
        this.outputs[0].setValue(
            this.latchValue,
            0,
            time + this.outputs[0].delay,
            false,
            true
        );
        this.outputs[1].setValue(
            State.not(this.latchValue),
            0,
            time + this.outputs[1].delay,
            false,
            true
        );
    }
    static add() {
        Module.addToCircuit(new DFlipFlop({ name: "D Flip Flop" }));
    }
}

class TFlipFlop extends Module {
    constructor(obj) {
        if (obj.width == null) obj.width = 4;
        if (obj.height == null) obj.height = 4;
        super(obj);
        this.inputs = [
            new InputNode(this, "T", 0, 1),
            new InputNode(this, "Clock", 0, 2),
        ];
        this.outputs = [
            new OutputNode(this, "Q", 4, 1),
            new OutputNode(this, "Q'", 4, 3),
        ];
        this.inputs.forEach((node) => (node.pinDirection = 0));
        this.outputs.forEach((node) => (node.pinDirection = 2));
        this.displayName = "";
        this.latchValue = State.low;
        this.previousClk = State.low;
    }
    render(obj) {
        obj.labels = [
            ["T", 12, -25, -20, 2],
            [">", 24, -24, 0],
            ["Q", 12, 25, -20, 0],
            ["Q'", 12, 25, 20, 0],
        ];
        super.render(obj);
    }
    init() {
        super.init();
        this.latchValue = State.low;
        this.previousClk = State.low;
    }
    evaluate(time) {
        super.evaluate(time);
        let t = this.inputs[0].getValueAtTime(time)[0];
        let clk = this.previousClk;
        this.previousClk = this.inputs[1].getValueAtTime(time)[0];
        let rising = this.previousClk != clk && this.previousClk == State.high;
        if (rising && t == State.high) {
            if (this.latchValue == State.high) {
                this.latchValue = State.low;
            } else if (this.latchValue == State.low) {
                this.latchValue = State.high;
            }
        }
        this.outputs[0].setValue(
            this.latchValue,
            0,
            time + this.outputs[0].delay,
            false,
            true
        );
        this.outputs[1].setValue(
            State.not(this.latchValue),
            0,
            time + this.outputs[1].delay,
            false,
            true
        );
    }
    static add() {
        Module.addToCircuit(new TFlipFlop({ name: "T Flip Flop" }));
    }
}

class JKFlipFlop extends Module {
    constructor(obj) {
        if (obj.width == null) obj.width = 4;
        if (obj.height == null) obj.height = 4;
        super(obj);
        this.inputs = [
            new InputNode(this, "J", 0, 1),
            new InputNode(this, "K", 0, 3),
            new InputNode(this, "Clock", 0, 2),
        ];
        this.outputs = [
            new OutputNode(this, "Q", 4, 1),
            new OutputNode(this, "Q'", 4, 3),
        ];
        this.inputs.forEach((node) => (node.pinDirection = 0));
        this.outputs.forEach((node) => (node.pinDirection = 2));
        this.displayName = "T";
        this.latchValue = State.low;
        this.previousClk = State.low;
    }
    render(obj) {
        obj.labels = [
            ["J", 12, -25, -20, 2],
            ["K", 12, -25, 20, 2],
            [">", 24, -24, 0],
            ["Q", 12, 25, -20, 0],
            ["Q'", 12, 25, 20, 0],
        ];
        super.render(obj);
    }
    init() {
        super.init();
        this.latchValue = State.low;
        this.previousClk = State.low;
    }
    evaluate(time) {
        super.evaluate(time);
        let j = this.inputs[0].getValueAtTime(time)[0];
        let k = this.inputs[1].getValueAtTime(time)[0];

        let clk = this.previousClk;
        this.previousClk = this.inputs[2].getValueAtTime(time)[0];
        let rising = this.previousClk != clk && this.previousClk == State.high;

        if (rising) {
            this.latchValue = State.or([
                State.and([j, State.not(this.latchValue)]),
                State.and([this.latchValue, State.not(k)]),
            ]);
        }
        this.outputs[0].setValue(
            this.latchValue,
            0,
            time + this.outputs[0].delay,
            false,
            true
        );
        this.outputs[1].setValue(
            State.not(this.latchValue),
            0,
            time + this.outputs[1].delay,
            false,
            true
        );
    }
    static add() {
        Module.addToCircuit(new JKFlipFlop({ name: "JK Flip Flop" }));
    }
}

class Register extends Module {
    constructor(obj) {
        if (obj.width == null) obj.width = 4;
        if (obj.height == null) obj.height = 4;
        super(obj);
        this.inputs = [
            new InputNode(this, "Data", 0, 1),
            new InputNode(this, "Clock", 0, 2),
        ];
        this.outputs = [
            new OutputNode(this, "Q", 4, 1),
        ];
        this.inputs.forEach((node) => (node.pinDirection = 0));
        this.outputs.forEach((node) => (node.pinDirection = 2));
        this.displayName = "Register";
        this.latchValue = State.low;
        this.previousClk = State.low;
    }
    render(obj) {
        obj.labels = [
            ["D", 12, -25, -20, 2],
            [">", 24, -24, 0],
            ["Q", 12, 25, -20, 0]
        ];
        super.render(obj);
    }
    init() {
        super.init();
        this.latchValue = [State.low];
        this.previousClk = State.low;
    }
    evaluate(time) {
        super.evaluate(time);
        let d = this.inputs[0].getValueAtTime(time);
        let clk = this.previousClk;
        this.previousClk = this.inputs[1].getValueAtTime(time)[0];
        let rising = this.previousClk != clk && this.previousClk == State.high;
        if (rising) {
            for (let i in d) {
                if (d[i] == State.low || d[i] == State.high) {
                    this.latchValue[i] = d[i];
                } else {
                    this.latchValue[i] = State.err;
                }
            }
        }
        this.outputs[0].setValues(
            this.latchValue,
            time + this.outputs[0].delay,
            false,
            true
        );
    }
    static add() {
        Module.addToCircuit(new Register({ name: "Register" }));
    }
}

export { SRLatch, DLatch, DFlipFlop, TFlipFlop, JKFlipFlop, Register }