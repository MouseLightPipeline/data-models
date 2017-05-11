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
var RegistrationTransform;
(function (RegistrationTransform_1) {
    RegistrationTransform_1.ModelName = "RegistrationTransform";
    function sequelizeImport(sequelize, DataTypes) {
        const RegistrationTransform = sequelize.define(RegistrationTransform_1.ModelName, {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            location: DataTypes.TEXT,
            name: DataTypes.TEXT,
            notes: DataTypes.TEXT,
        }, {
            classMethods: {
                associate: (models) => {
                    RegistrationTransform.belongsTo(models.Sample, { foreignKey: "sampleId", as: "sample" });
                    RegistrationTransform.SampleModel = models.Sample;
                }
            },
            timestamps: true,
            paranoid: true
        });
        RegistrationTransform.SampleModel = null;
        RegistrationTransform.isDuplicate = (registrationTransform, id = null) => __awaiter(this, void 0, void 0, function* () {
            const dupes = yield RegistrationTransform.findAll({
                where: {
                    sampleId: registrationTransform.sampleId,
                    location: registrationTransform.location
                }
            });
            return dupes.length > 0 && (!id || (id !== dupes[0].id));
        });
        RegistrationTransform.createFromInput = (registrationTransform) => __awaiter(this, void 0, void 0, function* () {
            if (!registrationTransform.location || registrationTransform.location.length === 0) {
                throw { message: "location is a required input" };
            }
            if (yield RegistrationTransform.isDuplicate(registrationTransform)) {
                throw { message: `The location "${registrationTransform.location}" already exists for this sample` };
            }
            const sample = yield RegistrationTransform.SampleModel.findById(registrationTransform.sampleId);
            if (!sample) {
                throw { message: "the sample can not be found" };
            }
            return yield RegistrationTransform.create({
                location: registrationTransform.location,
                name: registrationTransform.name || "",
                notes: registrationTransform.notes || "",
                sampleId: registrationTransform.sampleId
            });
        });
        RegistrationTransform.updateFromInput = (registrationTransform) => __awaiter(this, void 0, void 0, function* () {
            let row = yield RegistrationTransform.findById(registrationTransform.id);
            if (!row) {
                throw { message: "The registration transform could not be found" };
            }
            if (registrationTransform.location && (yield RegistrationTransform.isDuplicate(registrationTransform, registrationTransform.id))) {
                throw { row, message: `The name "${registrationTransform.location}" has already been used` };
            }
            // Undefined is ok (no update) - null, or empty is not.
            if (!util_1.isUndefined(registrationTransform.location) && (util_1.isNull(registrationTransform.location) || (registrationTransform.location.length === 0))) {
                throw { row, message: "Location cannot be empty" };
            }
            // Same as above, but also must be existing sample
            if (util_1.isNull(registrationTransform.sampleId)) {
                throw { row, message: "Sample id cannot be empty" };
            }
            if (registrationTransform.sampleId) {
                if (!util_1.isUndefined(registrationTransform.location) && registrationTransform.location.length === 0) {
                    throw { row, message: "Sample id cannot be empty" };
                }
                const sample = yield RegistrationTransform.SampleModel.findById(registrationTransform.sampleId);
                if (!sample) {
                    throw { row, message: "The sample can not be found" };
                }
            }
            // Undefined is ok (no update) - but prefer not null
            if (util_1.isNull(registrationTransform.name)) {
                registrationTransform.name = "";
            }
            if (util_1.isNull(registrationTransform.notes)) {
                registrationTransform.notes = "";
            }
            return row.update(registrationTransform);
        });
        RegistrationTransform.deleteFromInput = (registrationTransform) => __awaiter(this, void 0, void 0, function* () {
            // Note - there is nothing here to prevent dangling transformed tracings.  Caller assumes responsibility to
            // enforce relationships across database boundaries.
            if (!registrationTransform.id || registrationTransform.id.length === 0) {
                throw { message: "id is a required input" };
            }
            return yield RegistrationTransform.destroy({ where: { id: registrationTransform.id } });
        });
        return RegistrationTransform;
    }
    RegistrationTransform_1.sequelizeImport = sequelizeImport;
})(RegistrationTransform = exports.RegistrationTransform || (exports.RegistrationTransform = {}));
//# sourceMappingURL=registrationTransform.js.map