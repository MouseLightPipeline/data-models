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
const ModelName = "MouseStrain";
class MouseStrainModelDefinition {
    constructor() {
        this._modelName = ModelName;
    }
    get modelName() { return this._modelName; }
    sequelizeImport(sequelize, DataTypes) {
        const MouseStrain = sequelize.define(ModelName, {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            name: DataTypes.TEXT
        }, {
            classMethods: {
                associate: (models) => {
                    MouseStrain.hasMany(models.Sample, { foreignKey: "mouseStrainId", as: "samples" });
                }
            },
            timestamps: true,
            paranoid: true
        });
        MouseStrain.duplicateWhereClause = (name) => {
            return { where: sequelize.where(sequelize.fn("lower", sequelize.col("name")), sequelize.fn("lower", name)) };
        };
        MouseStrain.findDuplicate = (name) => __awaiter(this, void 0, void 0, function* () {
            if (!name) {
                return null;
            }
            return MouseStrain.findOne(MouseStrain.duplicateWhereClause(name));
        });
        /**
         * Complex where clause to allow for case insensitive requires defaults property.  Wrapping for consistency as
         * a result.
         * @param {IMouseStrainInput} mouseStrain define name property
         **/
        MouseStrain.findOrCreateFromInput = (mouseStrain) => __awaiter(this, void 0, void 0, function* () {
            const options = MouseStrain.duplicateWhereClause(mouseStrain.name);
            options["defaults"] = { name: mouseStrain.name };
            return MouseStrain.findOrCreate(options);
        });
        MouseStrain.createFromInput = (mouseStrain) => __awaiter(this, void 0, void 0, function* () {
            if (!mouseStrain) {
                throw { message: "Mouse strain properties are a required input" };
            }
            if (!mouseStrain.name) {
                throw { message: "name is a required input" };
            }
            const duplicate = yield MouseStrain.findDuplicate(mouseStrain.name);
            if (duplicate) {
                throw { message: `The name "${mouseStrain.name}" has already been used` };
            }
            return yield MouseStrain.create({
                name: mouseStrain.name
            });
        });
        MouseStrain.updateFromInput = (mouseStrain) => __awaiter(this, void 0, void 0, function* () {
            if (!mouseStrain) {
                throw { message: "Mouse strain properties are a required input" };
            }
            if (!mouseStrain.id) {
                throw { message: "Mouse strain input must contain the id of the object to update" };
            }
            let row = yield MouseStrain.findById(mouseStrain.id);
            if (!row) {
                throw { message: "The mouse strain could not be found" };
            }
            // Undefined is ok - although strange as that is the only property at the moment.
            if (modelUtil_1.isNullOrEmpty(mouseStrain.name)) {
                throw { message: "name cannot be empty or null" };
            }
            const duplicate = yield MouseStrain.findDuplicate(mouseStrain.name);
            if (duplicate && duplicate.id !== mouseStrain.id) {
                throw { message: `The strain "${mouseStrain.name}" has already been created` };
            }
            return row.update(mouseStrain);
        });
        return MouseStrain;
    }
}
exports.MouseStrain = new MouseStrainModelDefinition();
//# sourceMappingURL=mouseStrain.js.map