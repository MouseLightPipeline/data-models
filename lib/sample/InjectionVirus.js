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
var InjectionVirus;
(function (InjectionVirus_1) {
    InjectionVirus_1.ModelName = "InjectionVirus";
    function sequelizeImport(sequelize, DataTypes) {
        const InjectionVirus = sequelize.define(InjectionVirus_1.ModelName, {
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
        InjectionVirus.isDuplicate = (injectionVirus, id = null) => __awaiter(this, void 0, void 0, function* () {
            const dupes = yield InjectionVirus.findAll({ where: { name: { $iLike: injectionVirus.name } } });
            return dupes.length > 0 && (!id || (id !== dupes[0].id));
        });
        InjectionVirus.createFromInput = (injectionVirus) => __awaiter(this, void 0, void 0, function* () {
            if (!injectionVirus.name || injectionVirus.name.length === 0) {
                throw { message: "name is a required input" };
            }
            if (yield InjectionVirus.isDuplicate(injectionVirus)) {
                throw { message: `The name "${injectionVirus.name}" has already been used` };
            }
            return yield InjectionVirus.create({
                name: injectionVirus.name
            });
        });
        InjectionVirus.updateFromInput = (injectionVirus) => __awaiter(this, void 0, void 0, function* () {
            let row = yield InjectionVirus.findById(injectionVirus.id);
            if (!row) {
                throw { message: "The injection virus could not be found" };
            }
            if (injectionVirus.name && (yield InjectionVirus.isDuplicate(injectionVirus, injectionVirus.id))) {
                throw { message: `The name "${injectionVirus.name}" has already been used` };
            }
            // Undefined is ok - although strange as that is the only property at the moment.
            if (util_1.isNull(injectionVirus.name) || (injectionVirus.name && injectionVirus.name.length === 0)) {
                throw { message: "name cannot be empty" };
            }
            return row.update(injectionVirus);
        });
        return InjectionVirus;
    }
    InjectionVirus_1.sequelizeImport = sequelizeImport;
})(InjectionVirus = exports.InjectionVirus || (exports.InjectionVirus = {}));
//# sourceMappingURL=InjectionVirus.js.map