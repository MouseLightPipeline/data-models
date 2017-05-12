"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ModelName = "BrainArea";
class BrainAreaModelDefinition {
    constructor() {
        this._modelName = ModelName;
    }
    get modelName() { return this._modelName; }
    sequelizeImport(sequelize, DataTypes) {
        const BrainArea = sequelize.define(ModelName, {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            structureId: DataTypes.INTEGER,
            depth: DataTypes.INTEGER,
            name: DataTypes.TEXT,
            parentStructureId: DataTypes.INTEGER,
            structureIdPath: DataTypes.TEXT,
            safeName: DataTypes.TEXT,
            acronym: DataTypes.TEXT,
            atlasId: DataTypes.INTEGER,
            graphId: DataTypes.INTEGER,
            graphOrder: DataTypes.INTEGER,
            hemisphereId: DataTypes.INTEGER,
            geometryFile: DataTypes.TEXT,
            geometryColor: DataTypes.TEXT,
            geometryEnable: DataTypes.BOOLEAN
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
}
exports.BrainArea = new BrainAreaModelDefinition();
//# sourceMappingURL=BrainArea.js.map