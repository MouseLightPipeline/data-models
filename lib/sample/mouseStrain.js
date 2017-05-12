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
        MouseStrain.isDuplicate = (mouseStrain, id = null) => __awaiter(this, void 0, void 0, function* () {
            const dupes = yield MouseStrain.findAll({ where: { name: { $iLike: mouseStrain.name } } });
            return dupes.length > 0 && (!id || (id !== dupes[0].id));
        });
        MouseStrain.createFromInput = (mouseStrain) => __awaiter(this, void 0, void 0, function* () {
            if (!mouseStrain.name || mouseStrain.name.length === 0) {
                throw { message: "name is a required input" };
            }
            if (yield MouseStrain.isDuplicate(mouseStrain)) {
                throw { message: `The name "${mouseStrain.name}" has already been used` };
            }
            return yield MouseStrain.create({
                name: mouseStrain.name
            });
        });
        MouseStrain.updateFromInput = (mouseStrain) => __awaiter(this, void 0, void 0, function* () {
            let row = yield MouseStrain.findById(mouseStrain.id);
            if (!row) {
                throw { message: "The mouse strain could not be found" };
            }
            if (mouseStrain.name && (yield MouseStrain.isDuplicate(mouseStrain, mouseStrain.id))) {
                throw { message: `The name "${mouseStrain.name}" has already been used` };
            }
            // Undefined is ok - although strange as that is the only property to update at the moment.
            if (util_1.isNull(mouseStrain.name) || (mouseStrain.name && mouseStrain.name.length === 0)) {
                throw { message: "name cannot be empty" };
            }
            return row.update(mouseStrain);
        });
        return MouseStrain;
    }
}
exports.MouseStrain = new MouseStrainModelDefinition();
//# sourceMappingURL=mouseStrain.js.map