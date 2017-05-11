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
exports.ModelName = "Fluorophore";
function sequelizeImport(sequelize, DataTypes) {
    const Fluorophore = sequelize.define(exports.ModelName, {
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
    Fluorophore.isDuplicate = (fluorophore, id = null) => __awaiter(this, void 0, void 0, function* () {
        const dupes = yield Fluorophore.findAll({ where: { name: { $iLike: fluorophore.name } } });
        return dupes.length > 0 && (!id || (id !== dupes[0].id));
    });
    Fluorophore.createFromInput = (fluorophore) => __awaiter(this, void 0, void 0, function* () {
        if (!fluorophore.name || fluorophore.name.length === 0) {
            throw { message: "name is a required input" };
        }
        if (yield Fluorophore.isDuplicate(fluorophore)) {
            throw { message: `The name "${fluorophore.name}" has already been used` };
        }
        return yield Fluorophore.create({
            name: fluorophore.name
        });
    });
    Fluorophore.updateFromInput = (fluorophore) => __awaiter(this, void 0, void 0, function* () {
        let row = yield Fluorophore.findById(fluorophore.id);
        if (!row) {
            throw { message: "The fluorophore could not be found" };
        }
        if (fluorophore.name && (yield Fluorophore.isDuplicate(fluorophore, fluorophore.id))) {
            throw { message: `The name "${Fluorophore.name}" has already been used` };
        }
        // Undefined is ok - although strange as that is the only property at the moment.
        if (util_1.isNull(fluorophore.name) || (fluorophore.name && fluorophore.name.length === 0)) {
            throw { message: "name cannot be empty" };
        }
        return row.update(fluorophore);
    });
    return Fluorophore;
}
exports.sequelizeImport = sequelizeImport;
//# sourceMappingURL=fluorophore.js.map