"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const modelUtil_1 = require("../util/modelUtil");
const ModelName = "Injection";
class InjectionModelDefinition {
    constructor() {
        this._modelName = ModelName;
    }
    get modelName() {
        return this._modelName;
    }
    sequelizeImport(sequelize, DataTypes) {
        const Injection = sequelize.define(ModelName, {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
        }, {
            classMethods: {
                associate: (models) => {
                    Injection.belongsTo(models.Sample, { foreignKey: "sampleId", as: "sample" });
                    Injection.belongsTo(models.BrainArea, { foreignKey: "brainAreaId", as: "brainArea" });
                    Injection.belongsTo(models.InjectionVirus, { foreignKey: "injectionVirusId", as: "injectionVirus" });
                    Injection.belongsTo(models.Fluorophore, { foreignKey: "fluorophoreId", as: "fluorophore" });
                    Injection.hasMany(models.Neuron, { foreignKey: "injectionId", as: "neurons" });
                    Injection.InjectionVirusModel = models.InjectionVirus;
                    Injection.FluorophoreModel = models.Fluorophore;
                }
            },
            timestamps: true,
            paranoid: true
        });
        Injection.InjectionVirusModel = null;
        Injection.FluorophoreModel = null;
        /**
         * A given sample can have one injection per brain area/compartment.
         * @param injectionInput
         * @returns {Promise<IFluorophore>}
         */
        Injection.findDuplicate = (injectionInput) => __awaiter(this, void 0, void 0, function* () {
            if (!injectionInput || !injectionInput.sampleId || !injectionInput.brainAreaId) {
                return null;
            }
            return Injection.findOne({
                where: {
                    sampleId: injectionInput.sampleId,
                    brainAreaId: injectionInput.brainAreaId
                }
            });
        });
        Injection.createFromInput = (injectionInput) => __awaiter(this, void 0, void 0, function* () {
            if (!injectionInput) {
                throw { message: "Injection properties are a required input" };
            }
            if (!injectionInput.sampleId) {
                throw { message: "Sample is a required input" };
            }
            if (!injectionInput.brainAreaId) {
                throw { message: "Brain area is a required input" };
            }
            const duplicate = yield Injection.findDuplicate(injectionInput);
            if (duplicate) {
                throw { message: `An injection for this sample in this brain compartment exists` };
            }
            let injectionVirusId = null;
            if (injectionInput.injectionVirusName) {
                const out = yield Injection.InjectionVirusModel.findOrCreateFromInput({
                    name: injectionInput.injectionVirusName
                });
                injectionVirusId = out[0].id;
            }
            else {
                injectionVirusId = injectionInput.injectionVirusId;
            }
            if (!injectionVirusId) {
                throw { message: "Injection virus is a required input" };
            }
            let fluorophoreId = null;
            if (injectionInput.fluorophoreName) {
                const out = yield Injection.FluorophoreModel.findOrCreateFromInput({
                    name: injectionInput.fluorophoreName
                });
                fluorophoreId = out[0].id;
            }
            else {
                fluorophoreId = injectionInput.fluorophoreId;
            }
            if (!fluorophoreId) {
                throw { message: "Fluorophore is a required input" };
            }
            return yield Injection.create({
                sampleId: injectionInput.sampleId,
                brainAreaId: injectionInput.brainAreaId,
                injectionVirusId: injectionVirusId,
                fluorophoreId: fluorophoreId
            });
        });
        Injection.updateFromInput = (injectionInput) => __awaiter(this, void 0, void 0, function* () {
            if (!injectionInput) {
                throw { message: "Injection properties are a required input" };
            }
            if (!injectionInput.id) {
                throw { message: "Injection input must contain the id of the object to update" };
            }
            let row = yield Injection.findById(injectionInput.id);
            if (!row) {
                throw { message: "The injection could not be found" };
            }
            // Undefined is ok (i.e., no update), null/empty is not allowed
            if (modelUtil_1.isNullOrEmpty(injectionInput.sampleId)) {
                throw { message: "sample id must be a valid sample" };
            }
            if (modelUtil_1.isNullOrEmpty(injectionInput.brainAreaId)) {
                throw { message: "brain area id must be a valid sample" };
            }
            if (modelUtil_1.isNullOrEmpty(injectionInput.injectionVirusId)) {
                throw { message: "injection virus id must be a valid sample" };
            }
            if (modelUtil_1.isNullOrEmpty(injectionInput.fluorophoreId)) {
                throw { message: "fluorophore id must be a valid sample" };
            }
            return row.update(injectionInput);
        });
        Injection.deleteFromInput = (injection) => __awaiter(this, void 0, void 0, function* () {
            // Note - there is nothing here to prevent dangling transformed tracings.  Caller assumes responsibility to
            // enforce relationships across database boundaries.
            if (!injection.id) {
                throw { message: "id is a required input" };
            }
            return yield Injection.destroy({ where: { id: injection.id } });
        });
        return Injection;
    }
}
exports.Injection = new InjectionModelDefinition();
//# sourceMappingURL=injection.js.map