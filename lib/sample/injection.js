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
const util_1 = require("util");
var Injection;
(function (Injection_1) {
    Injection_1.ModelName = "Injection";
    function sequelizeImport(sequelize, DataTypes) {
        const Injection = sequelize.define(Injection_1.ModelName, {
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
                }
            },
            timestamps: true,
            paranoid: true
        });
        Injection.createFromInput = (injection) => __awaiter(this, void 0, void 0, function* () {
            if (!injection.sampleId || injection.sampleId.length === 0) {
                throw { message: "sample id is a required input" };
            }
            if (!injection.brainAreaId || injection.brainAreaId.length === 0) {
                throw { message: "brain area is a required input" };
            }
            if (!injection.injectionVirusId || injection.injectionVirusId.length === 0) {
                throw { message: "injection virus is a required input" };
            }
            if (!injection.fluorophoreId || injection.fluorophoreId.length === 0) {
                throw { message: "fluorophore is a required input" };
            }
            return yield Injection.create({
                sampleId: injection.sampleId,
                brainAreaId: injection.brainAreaId,
                injectionVirusId: injection.injectionVirusId,
                fluorophoreId: injection.fluorophoreId
            });
        });
        Injection.updateFromInput = (injection) => __awaiter(this, void 0, void 0, function* () {
            let row = yield Injection.findById(injection.id);
            if (!row) {
                throw { message: "The injection could not be found" };
            }
            // Undefined is ok, null is not allowed
            if (util_1.isNull(injection.sampleId) || (injection.sampleId && injection.sampleId.length === 0)) {
                throw { message: "sample id must be a valid sample" };
            }
            if (util_1.isNull(injection.brainAreaId) || (injection.brainAreaId && injection.brainAreaId.length === 0)) {
                throw { message: "brain area id must be a valid sample" };
            }
            if (util_1.isNull(injection.injectionVirusId) || (injection.injectionVirusId && injection.injectionVirusId.length === 0)) {
                throw { message: "injection virus id must be a valid sample" };
            }
            if (util_1.isNull(injection.fluorophoreId) || (injection.fluorophoreId && injection.fluorophoreId.length === 0)) {
                throw { message: "fluorophore id must be a valid sample" };
            }
            return row.update(injection);
        });
        return Injection;
    }
    Injection_1.sequelizeImport = sequelizeImport;
})(Injection = exports.Injection || (exports.Injection = {}));
//# sourceMappingURL=injection.js.map