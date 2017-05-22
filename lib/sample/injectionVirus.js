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
const ModelName = "InjectionVirus";
class InjectionVirusModelDefinition {
    constructor() {
        this._modelName = ModelName;
    }
    get modelName() { return this._modelName; }
    sequelizeImport(sequelize, DataTypes) {
        const InjectionVirus = sequelize.define(ModelName, {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            name: DataTypes.TEXT
        }, {
            classMethods: {
                associate: (models) => {
                    InjectionVirus.hasMany(models.Injection, { foreignKey: "injectionVirusId", as: "injections" });
                }
            },
            tableName: "InjectionViruses",
            timestamps: true,
            paranoid: true
        });
        InjectionVirus.duplicateWhereClause = (name) => {
            return { where: sequelize.where(sequelize.fn("lower", sequelize.col("name")), sequelize.fn("lower", name)) };
        };
        InjectionVirus.findDuplicate = (name) => __awaiter(this, void 0, void 0, function* () {
            if (!name) {
                return null;
            }
            return InjectionVirus.findOne(InjectionVirus.duplicateWhereClause(name));
        });
        /**
         * Complex where clause to allow for case insensitive requires defaults property.  Wrapping for consistency as
         * a result.
         * @param {IFluorophoreInput} fluorophore define name property
         **/
        InjectionVirus.findOrCreateFromInput = (fluorophore) => __awaiter(this, void 0, void 0, function* () {
            const options = InjectionVirus.duplicateWhereClause(fluorophore.name);
            options["defaults"] = { name: fluorophore.name };
            return InjectionVirus.findOrCreate(options);
        });
        InjectionVirus.createFromInput = (virusInput) => __awaiter(this, void 0, void 0, function* () {
            if (!virusInput) {
                throw { message: "Injection virus properties are a required input" };
            }
            if (!virusInput.name) {
                throw { message: "name is a required input" };
            }
            const duplicate = yield InjectionVirus.findDuplicate(virusInput.name);
            if (duplicate) {
                throw { message: `The name "${virusInput.name}" has already been used` };
            }
            return yield InjectionVirus.create({
                name: virusInput.name
            });
        });
        InjectionVirus.updateFromInput = (virusInput) => __awaiter(this, void 0, void 0, function* () {
            if (!virusInput) {
                throw { message: "Injection virus properties are a required input" };
            }
            if (!virusInput.id) {
                throw { message: "Virus input must contain the id of the object to update" };
            }
            let row = yield InjectionVirus.findById(virusInput.id);
            if (!row) {
                throw { message: "The injection virus could not be found" };
            }
            // Undefined is ok - although strange as that is the only property at the moment.
            if (modelUtil_1.isNullOrEmpty(virusInput.name)) {
                throw { message: "name cannot be empty" };
            }
            const duplicate = yield InjectionVirus.findDuplicate(virusInput.name);
            if (duplicate && duplicate.id !== virusInput.id) {
                throw { message: `The name "${virusInput.name}" has already been used` };
            }
            return row.update(virusInput);
        });
        return InjectionVirus;
    }
}
exports.InjectionVirus = new InjectionVirusModelDefinition();
//# sourceMappingURL=injectionVirus.js.map