"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=modelLoader.js.map