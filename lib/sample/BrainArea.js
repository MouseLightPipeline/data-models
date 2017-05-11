"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BrainArea;
(function (BrainArea_1) {
    BrainArea_1.ModelName = "BrainArea";
    function sequelizeImport(sequelize, DataTypes) {
        const BrainArea = sequelize.define(BrainArea_1.ModelName, {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            structureId: DataTypes.INTEGER,
            depth: DataTypes.INTEGER,
            parentStructureId: DataTypes.INTEGER,
            structureIdPath: DataTypes.TEXT,
            name: DataTypes.TEXT,
            safeName: DataTypes.TEXT,
            acronym: DataTypes.TEXT
        }, {
            classMethods: {
                associate: (models) => {
                    BrainArea.hasMany(models.Injection, { foreignKey: "brainAreaId", as: "injections" });
                    BrainArea.hasMany(models.Neuron, { foreignKey: "brainAreaId", as: "neurons" });
                }
            },
            timestamps: true,
            paranoid: true
        });
        return BrainArea;
    }
    BrainArea_1.sequelizeImport = sequelizeImport;
})(BrainArea = exports.BrainArea || (exports.BrainArea = {}));
//# sourceMappingURL=BrainArea.js.map