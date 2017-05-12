"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const brainArea_1 = require("./sample/brainArea");
const fluorophore_1 = require("./sample/fluorophore");
const injection_1 = require("./sample/injection");
const InjectionVirus_1 = require("./sample/InjectionVirus");
const mousestrain_1 = require("./sample/mousestrain");
const neuron_1 = require("./sample/neuron");
const registrationTransform_1 = require("./sample/registrationTransform");
const sample_1 = require("./sample/sample");
var BrainArea_1 = require("./sample/BrainArea");
exports.BrainArea = BrainArea_1.BrainArea;
var Fluorophore_1 = require("./sample/Fluorophore");
exports.Fluorophore = Fluorophore_1.Fluorophore;
var Injection_1 = require("./sample/Injection");
exports.Injection = Injection_1.Injection;
var InjectionVirus_2 = require("./sample/InjectionVirus");
exports.InjectionVirus = InjectionVirus_2.InjectionVirus;
var MouseStrain_1 = require("./sample/MouseStrain");
exports.MouseStrain = MouseStrain_1.MouseStrain;
var Neuron_1 = require("./sample/Neuron");
exports.Neuron = Neuron_1.Neuron;
var RegistrationTransform_1 = require("./sample/RegistrationTransform");
exports.RegistrationTransform = RegistrationTransform_1.RegistrationTransform;
var Sample_1 = require("./sample/Sample");
exports.Sample = Sample_1.Sample;
exports.AllSampleModels = [
    brainArea_1.BrainArea,
    fluorophore_1.Fluorophore,
    injection_1.Injection,
    InjectionVirus_1.InjectionVirus,
    mousestrain_1.MouseStrain,
    neuron_1.Neuron,
    registrationTransform_1.RegistrationTransform,
    sample_1.Sample
];
function loadModels(db, modelNamespaces) {
    const models = {};
    modelNamespaces.forEach(ns => {
        models[ns.modelName] = db.import(ns.modelName, ns.sequelizeImport);
    });
    Object.keys(models).map(modelName => {
        if (models[modelName].associate) {
            models[modelName].associate(models);
        }
        if (models[modelName].prepareContents) {
            models[modelName].prepareContents(models);
        }
    });
    return models;
}
exports.loadModels = loadModels;
function loadSampleModels(db) {
    return loadModels(db, exports.AllSampleModels);
}
exports.loadSampleModels = loadSampleModels;
//# sourceMappingURL=index.js.map