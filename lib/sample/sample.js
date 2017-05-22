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
const ModelName = "Sample";
class SampleModelDefinition {
    constructor() {
        this._modelName = ModelName;
    }
    get modelName() {
        return this._modelName;
    }
    sequelizeImport(sequelize, DataTypes) {
        const Sample = sequelize.define(ModelName, {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            idNumber: {
                type: DataTypes.INTEGER,
                defaultValue: -1
            },
            animalId: DataTypes.TEXT,
            tag: {
                type: DataTypes.TEXT,
                defaultValue: ""
            },
            comment: {
                type: DataTypes.TEXT,
                defaultValue: ""
            },
            sampleDate: DataTypes.DATE,
            activeRegistrationTransformId: {
                type: DataTypes.TEXT,
                defaultValue: "",
            },
            sharing: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            }
        }, {
            classMethods: {
                associate: (models) => {
                    Sample.hasMany(models.Injection, { foreignKey: "sampleId", as: "injections" });
                    Sample.hasMany(models.RegistrationTransform, {
                        foreignKey: "sampleId",
                        as: "registrationTransforms"
                    });
                    Sample.belongsTo(models.MouseStrain, { foreignKey: "mouseStrainId", as: "mouseStrain" });
                    Sample.MouseStrainModel = models.MouseStrain;
                }
            },
            timestamps: true,
            paranoid: true
        });
        Sample.MouseStrainModel = null;
        Sample.isDuplicate = (sample, id = null) => __awaiter(this, void 0, void 0, function* () {
            const dupes = yield Sample.findAll({ where: { idNumber: sample.idNumber } });
            return dupes.length > 0 && (!id || (id !== dupes[0].id));
        });
        Sample.createFromInput = (sample) => __awaiter(this, void 0, void 0, function* () {
            if (util_1.isNullOrUndefined(sample)) {
                throw { message: "Sample input object is required" };
            }
            let idNumber = sample.idNumber;
            if (util_1.isNullOrUndefined(idNumber)) {
                const existing = yield Sample.findAll({
                    attributes: ["idNumber"],
                    order: [["idNumber", "DESC"]],
                    limit: 1
                }).map((o) => o.idNumber);
                if (existing) {
                    idNumber = existing[0] + 1;
                }
                else {
                    idNumber = 1;
                }
            }
            else if (yield Sample.isDuplicate(sample)) {
                throw { message: `The id number ${sample.idNumber} has already been used` };
            }
            const sampleDate = sample.sampleDate ? new Date(sample.sampleDate) : new Date();
            const animalId = sample.animalId || "";
            const tag = sample.tag || "";
            const comment = sample.comment || "";
            const activeRegistrationTransformId = sample.activeRegistrationTransformId || null;
            const mouseStrainId = sample.mouseStrainId || null;
            const sharing = sample.sharing || 0;
            return yield Sample.create({
                idNumber: idNumber,
                sampleDate: sampleDate,
                animalId: animalId,
                tag: tag,
                comment: comment,
                sharing: sharing,
                activeRegistrationTransformId: activeRegistrationTransformId,
                mouseStrainId: mouseStrainId
            });
        });
        Sample.updateFromInput = (sample) => __awaiter(this, void 0, void 0, function* () {
            // Ok to be undefined (and not updated) - not ok to be null
            if (util_1.isNull(sample.idNumber) || sample.idNumber && isNaN(sample.idNumber)) {
                throw { message: `The id number can not be empty` };
            }
            let row = yield Sample.findById(sample.id);
            if (!row) {
                throw { message: "The sample could not be found" };
            }
            if (sample.idNumber && (yield Sample.isDuplicate(sample, sample.id))) {
                throw { message: `The id number ${sample.idNumber} has already been used` };
            }
            // Ok to be undefined (and not updated) - not ok to be null
            if (util_1.isNull(sample.animalId)) {
                sample.animalId = "";
            }
            if (util_1.isNull(sample.tag)) {
                sample.tag = "";
            }
            if (util_1.isNull(sample.comment)) {
                sample.comment = "";
            }
            if (util_1.isNull(sample.sharing)) {
                sample.sharing = 0;
            }
            if (sample.mouseStrainName) {
                const out = yield Sample.MouseStrainModel.findOrCreateFromInput({
                    name: sample.mouseStrainName
                });
                sample.mouseStrainId = out[0].id;
            }
            return row.update(sample);
        });
        Sample.deleteFromInput = (sample) => __awaiter(this, void 0, void 0, function* () {
            if (!sample.id) {
                throw { message: "The sample id is a required input" };
            }
            return yield Sample.destroy({ where: { id: sample.id } });
        });
        return Sample;
    }
}
exports.Sample = new SampleModelDefinition();
//# sourceMappingURL=sample.js.map