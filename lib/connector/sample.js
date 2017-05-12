"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const brainArea_1 = require("../sample/brainArea");
const fluorophore_1 = require("../sample/fluorophore");
const injection_1 = require("../sample/injection");
const injectionVirus_1 = require("../sample/injectionVirus");
const mouseStrain_1 = require("../sample/mouseStrain");
const neuron_1 = require("../sample/neuron");
const registrationTransform_1 = require("../sample/registrationTransform");
const sample_1 = require("../sample/sample");
const connector_1 = require("./connector");
exports.AllSampleModels = [
    brainArea_1.BrainArea,
    fluorophore_1.Fluorophore,
    injection_1.Injection,
    injectionVirus_1.InjectionVirus,
    mouseStrain_1.MouseStrain,
    neuron_1.Neuron,
    registrationTransform_1.RegistrationTransform,
    sample_1.Sample
];
class SampleConnector extends connector_1.Connector {
    constructor(connectionOptions) {
        super(connectionOptions, exports.AllSampleModels);
    }
}
exports.SampleConnector = SampleConnector;
//# sourceMappingURL=sample.js.map