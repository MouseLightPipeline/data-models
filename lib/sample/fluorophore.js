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
const ModelName = "Fluorophore";
class FluorophoreModelDefinition {
    constructor() {
        this._modelName = ModelName;
    }
    get modelName() {
        return this._modelName;
    }
    sequelizeImport(sequelize, DataTypes) {
        const Fluorophore = sequelize.define(ModelName, {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            name: DataTypes.TEXT
        }, {
            classMethods: {
                associate: (models) => {
                    Fluorophore.hasMany(models.Injection, { foreignKey: "fluorophoreId", as: "injections" });
                }
            },
            timestamps: true,
            paranoid: true
        });
        Fluorophore.duplicateWhereClause = (name) => {
            return { where: sequelize.where(sequelize.fn("lower", sequelize.col("name")), sequelize.fn("lower", name)) };
        };
        Fluorophore.findDuplicate = (name) => __awaiter(this, void 0, void 0, function* () {
            if (!name) {
                return null;
            }
            return Fluorophore.findOne(Fluorophore.duplicateWhereClause(name));
        });
        /**
         * Complex where clause to allow for case insensitive requires defaults property.  Wrapping for consistency as
         * a result.
         * @param {IFluorophoreInput} fluorophore define name property
         **/
        Fluorophore.findOrCreateFromInput = (fluorophore) => __awaiter(this, void 0, void 0, function* () {
            const options = Fluorophore.duplicateWhereClause(fluorophore.name);
            options["defaults"] = { name: fluorophore.name };
            return Fluorophore.findOrCreate(options);
        });
        Fluorophore.createFromInput = (fluorophoreInput) => __awaiter(this, void 0, void 0, function* () {
            if (!fluorophoreInput) {
                throw { message: "Fluorophore properties are a required input" };
            }
            if (!fluorophoreInput.name) {
                throw { message: "name is a required input" };
            }
            const duplicate = yield Fluorophore.findDuplicate(fluorophoreInput.name);
            if (duplicate) {
                throw { message: `The name "${fluorophoreInput.name}" has already been used` };
            }
            return yield Fluorophore.create({
                name: fluorophoreInput.name
            });
        });
        Fluorophore.updateFromInput = (fluorophoreInput) => __awaiter(this, void 0, void 0, function* () {
            if (!fluorophoreInput) {
                throw { message: "Fluorophore properties are a required input" };
            }
            if (!fluorophoreInput.id) {
                throw { message: "Fluorophore input must contain the id of the object to update" };
            }
            let row = yield Fluorophore.findById(fluorophoreInput.id);
            if (!row) {
                throw { message: "The fluorophore could not be found" };
            }
            // Undefined is ok - although strange as that is the only property at the moment.
            if (modelUtil_1.isNullOrEmpty(fluorophoreInput.name)) {
                throw { message: "name cannot be empty or null" };
            }
            const duplicate = yield Fluorophore.findDuplicate(fluorophoreInput.name);
            if (duplicate && duplicate.id !== fluorophoreInput.id) {
                throw { message: `The name "${fluorophoreInput.name}" has already been used` };
            }
            return row.update(fluorophoreInput);
        });
        return Fluorophore;
    }
}
exports.Fluorophore = new FluorophoreModelDefinition();
//# sourceMappingURL=fluorophore.js.map