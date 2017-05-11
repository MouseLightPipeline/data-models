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
var Neuron;
(function (Neuron_1) {
    Neuron_1.ModelName = "Neuron";
    function sequelizeImport(sequelize, DataTypes) {
        const Neuron = sequelize.define(Neuron_1.ModelName, {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            idNumber: {
                type: DataTypes.INTEGER,
                defaultValue: -1
            },
            idString: {
                type: DataTypes.TEXT,
                defaultValue: ""
            },
            tag: {
                type: DataTypes.TEXT,
                defaultValue: ""
            },
            keywords: {
                type: DataTypes.TEXT,
                defaultValue: ""
            },
            x: {
                type: DataTypes.DOUBLE,
                defaultValue: 0
            },
            y: {
                type: DataTypes.DOUBLE,
                defaultValue: 0
            },
            z: {
                type: DataTypes.DOUBLE,
                defaultValue: 0
            },
        }, {
            classMethods: {
                associate: (models) => {
                    Neuron.belongsTo(models.Injection, { foreignKey: "injectionId", as: "injection" });
                    Neuron.belongsTo(models.BrainArea, {
                        foreignKey: { name: "brainAreaId", allowNull: true },
                        as: "brainArea"
                    });
                    Neuron.BrainAreaModel = models.BrainArea;
                    Neuron.InjectionModel = models.Injection;
                    Neuron.SampleModel = models.Sample;
                }
            },
            timestamps: true,
            paranoid: true
        });
        Neuron.BrainAreaModel = null;
        Neuron.InjectionModel = null;
        Neuron.SampleModel = null;
        Neuron.isDuplicate = (neuron, id = null) => __awaiter(this, void 0, void 0, function* () {
            const injection = yield Neuron.InjectionModel.findById(neuron.injectionId);
            if (!injection) {
                return false;
            }
            const sample = yield Neuron.SampleModel.findById(injection.sampleId);
            if (!sample) {
                return false;
            }
            // Now get all injections for this sample.
            const injectionIds = yield Neuron.InjectionModel.findAll({ where: { sampleId: sample.id } }).map((i) => i.id);
            if (injectionIds.length === 0) {
                return false;
            }
            // All neurons for sample (via injections) that have the same idString
            const dupes = yield Neuron.findAll({ where: { injectionId: { $in: injectionIds }, idString: neuron.idString } });
            return dupes.length > 0 && (!id || (id !== dupes[0].id));
        });
        Neuron.createFromInput = (neuron) => __awaiter(this, void 0, void 0, function* () {
            if (!neuron.idString || neuron.idString.length === 0) {
                throw { message: "idString is a required input" };
            }
            const injection = yield Neuron.InjectionModel.findById(neuron.injectionId);
            if (!injection) {
                throw { message: "the injection can not be found" };
            }
            const brainArea = yield Neuron.InjectionModel.findById(neuron.brainAreaId);
            if (!brainArea) {
                throw { message: "the brain area can not be found" };
            }
            if (yield Neuron.isDuplicate(neuron)) {
                throw { message: `A neuron id "${neuron.idString}" already exists on this sample` };
            }
            return yield Neuron.create({
                idNumber: neuron.idNumber || 0,
                idString: neuron.idString || "",
                tag: neuron.tag || "",
                keywords: neuron.keywords || "",
                x: neuron.x || 0,
                y: neuron.y || 0,
                z: neuron.z || 0,
                brainAreaId: neuron.brainAreaId,
                injectionId: neuron.injectionId
            });
        });
        Neuron.updateFromInput = (neuron) => __awaiter(this, void 0, void 0, function* () {
            let row = yield Neuron.findById(neuron.id);
            if (!row) {
                throw { message: "The neuron could not be found" };
            }
            if (neuron.idString && neuron.injectionId && (yield Neuron.isDuplicate(neuron, neuron.id))) {
                throw { message: `A neuron id "${neuron.idString}" already exists on this sample` };
            }
            // Undefined is ok (no update) - null, or empty is not.
            if (util_1.isNull(neuron.idString) || (neuron.idString && neuron.idString.length === 0)) {
                throw { message: "idString cannot be empty" };
            }
            // Same as above, but also must be existing sample
            if (util_1.isNull(neuron.injectionId) || (neuron.injectionId && neuron.injectionId.length === 0)) {
                throw { message: "injection id cannot be empty" };
            }
            const injection = yield Neuron.InjectionModel.findById(neuron.injectionId);
            if (!injection) {
                throw { message: "the injection can not be found" };
            }
            if (util_1.isNull(neuron.brainAreaId) || (neuron.brainAreaId && neuron.brainAreaId.length === 0)) {
                throw { message: "injection id cannot be empty" };
            }
            const brainArea = yield Neuron.BrainAreaModel.findById(neuron.brainAreaId);
            if (!brainArea) {
                throw { message: "the brain area can not be found" };
            }
            // Undefined is ok (no update) - but prefer not null
            if (util_1.isNull(neuron.tag)) {
                neuron.tag = "";
            }
            if (util_1.isNull(neuron.keywords)) {
                neuron.keywords = "";
            }
            if (util_1.isNull(neuron.idNumber)) {
                neuron.idNumber = 0;
            }
            if (util_1.isNull(neuron.x)) {
                neuron.x = 0;
            }
            if (util_1.isNull(neuron.y)) {
                neuron.y = 0;
            }
            if (util_1.isNull(neuron.z)) {
                neuron.z = 0;
            }
            return row.update(neuron);
        });
        return Neuron;
    }
    Neuron_1.sequelizeImport = sequelizeImport;
})(Neuron = exports.Neuron || (exports.Neuron = {}));
//# sourceMappingURL=neuron.js.map