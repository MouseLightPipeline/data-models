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
        Injection.createFromInput = (injectionInput) => __awaiter(this, void 0, void 0, function* () {
            if (!injectionInput.sampleId || injectionInput.sampleId.length === 0) {
                throw { message: "sample id is a required input" };
            }
            if (!injectionInput.brainAreaId || injectionInput.brainAreaId.length === 0) {
                throw { message: "brain area is a required input" };
            }
            let injectionVirusId = null;
            if (injectionInput.injectionVirusName) {
                const out = yield Injection.FluorophoreModel.findOrCreate(Injection.FluorophoreModel.duplicateWhereClause(injectionInput.injectionVirusName));
                injectionVirusId = out[0].id;
            }
            else {
                injectionVirusId = injectionInput.injectionVirusId;
            }
            if (!injectionVirusId) {
                throw { message: "injection virus is a required input" };
            }
            let fluorophoreId = null;
            if (injectionInput.fluorophoreName) {
                const out = yield Injection.FluorophoreModel.findOrCreate(Injection.FluorophoreModel.duplicateWhereClause(injectionInput.fluorophoreName));
                fluorophoreId = out[0].id;
            }
            else {
                fluorophoreId = injectionInput.fluorophoreId;
            }
            if (!fluorophoreId) {
                throw { message: "fluorophore is a required input" };
            }
            return yield Injection.create({
                sampleId: injectionInput.sampleId,
                brainAreaId: injectionInput.brainAreaId,
                injectionVirusId: injectionVirusId,
                fluorophoreId: fluorophoreId
            });
        });
        Injection.updateFromInput = (injection) => __awaiter(this, void 0, void 0, function* () {
            let row = yield Injection.findById(injection.id);
            if (!row) {
                throw { message: "The injection could not be found" };
            }
            // Undefined is ok (i.e., no update), null/empty is not allowed
            if (modelUtil_1.isNullOrEmpty(injection.sampleId)) {
                throw { message: "sample id must be a valid sample" };
            }
            if (modelUtil_1.isNullOrEmpty(injection.brainAreaId)) {
                throw { message: "brain area id must be a valid sample" };
            }
            if (modelUtil_1.isNullOrEmpty(injection.injectionVirusId)) {
                throw { message: "injection virus id must be a valid sample" };
            }
            if (modelUtil_1.isNullOrEmpty(injection.fluorophoreId)) {
                throw { message: "fluorophore id must be a valid sample" };
            }
            return row.update(injection);
        });
        Injection.findVirusForInput = (injectionInput) => __awaiter(this, void 0, void 0, function* () {
            let injectionVirusId = null;
            if (injectionInput.injectionVirusName) {
                const existing = yield Injection.InjectionVirusModel.findOne({ where: sequelize.where(sequelize.fn('lower', sequelize.col('name')), sequelize.fn('lower', injectionInput.injectionVirusName)) });
                if (existing) {
                    injectionVirusId = existing.id;
                }
            }
            if (!injectionVirusId) {
                if (injectionInput.injectionVirusId) {
                    injectionVirusId = injectionInput.injectionVirusId;
                }
            }
            return injectionVirusId;
        });
        return Injection;
    }
}
exports.Injection = new InjectionModelDefinition();
//# sourceMappingURL=injection.js.map