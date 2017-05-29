"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
module.exports = {
    up: (queryInterface, Sequelize) => __awaiter(this, void 0, void 0, function* () {
        yield queryInterface.createTable("InjectionViruses", {
            id: {
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            name: Sequelize.TEXT,
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
            deletedAt: Sequelize.DATE
        });
        yield queryInterface.createTable("Fluorophores", {
            id: {
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            name: Sequelize.TEXT,
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
            deletedAt: Sequelize.DATE
        });
        yield queryInterface.createTable("MouseStrains", {
            id: {
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            name: Sequelize.TEXT,
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
            deletedAt: Sequelize.DATE
        });
        yield queryInterface.createTable("BrainAreas", {
            id: {
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            structureId: Sequelize.INTEGER,
            atlasId: Sequelize.INTEGER,
            graphId: Sequelize.INTEGER,
            graphOrder: Sequelize.INTEGER,
            hemisphereId: Sequelize.INTEGER,
            depth: Sequelize.INTEGER,
            parentStructureId: Sequelize.INTEGER,
            structureIdPath: Sequelize.TEXT,
            name: Sequelize.TEXT,
            safeName: Sequelize.TEXT,
            geometryFile: {
                type: Sequelize.TEXT,
                defaultValue: ""
            },
            geometryColor: {
                type: Sequelize.TEXT,
                defaultValue: ""
            },
            geometryEnable: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            acronym: Sequelize.TEXT,
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
            deletedAt: Sequelize.DATE
        });
        yield queryInterface.addIndex("BrainAreas", ["depth"]);
        yield queryInterface.addIndex("BrainAreas", ["parentStructureId"]);
        yield queryInterface.createTable("Samples", {
            id: {
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            idNumber: {
                type: Sequelize.INTEGER,
                defaultValue: -1
            },
            animalId: Sequelize.TEXT,
            tag: {
                type: Sequelize.TEXT,
                defaultValue: ""
            },
            comment: {
                type: Sequelize.TEXT,
                defaultValue: ""
            },
            sampleDate: Sequelize.DATE,
            activeRegistrationTransformId: {
                type: Sequelize.TEXT
            },
            mouseStrainId: {
                type: Sequelize.UUID,
                references: {
                    model: "MouseStrains",
                    key: "id"
                }
            },
            sharing: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
            deletedAt: Sequelize.DATE
        });
        yield queryInterface.addIndex("Samples", ["mouseStrainId"]);
        yield queryInterface.createTable("RegistrationTransforms", {
            id: {
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            location: Sequelize.TEXT,
            name: Sequelize.TEXT,
            notes: Sequelize.TEXT,
            sampleId: {
                type: Sequelize.UUID,
                references: {
                    model: "Samples",
                    key: "id"
                }
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
            deletedAt: Sequelize.DATE
        });
        yield queryInterface.addIndex("RegistrationTransforms", ["sampleId"]);
        yield queryInterface.createTable("Injections", {
            id: {
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            brainAreaId: {
                type: Sequelize.UUID,
                references: {
                    model: "BrainAreas",
                    key: "id"
                }
            },
            fluorophoreId: {
                type: Sequelize.UUID,
                references: {
                    model: "Fluorophores",
                    key: "id"
                }
            },
            injectionVirusId: {
                type: Sequelize.UUID,
                references: {
                    model: "InjectionViruses",
                    key: "id"
                }
            },
            sampleId: {
                type: Sequelize.UUID,
                references: {
                    model: "Samples",
                    key: "id"
                }
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
            deletedAt: Sequelize.DATE
        });
        yield queryInterface.addIndex("Injections", ["fluorophoreId"]);
        yield queryInterface.addIndex("Injections", ["injectionVirusId"]);
        yield queryInterface.addIndex("Injections", ["sampleId"]);
        yield queryInterface.createTable("Neurons", {
            id: {
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            idNumber: {
                type: Sequelize.INTEGER,
                defaultValue: -1
            },
            idString: {
                type: Sequelize.TEXT,
                defaultValue: ""
            },
            tag: {
                type: Sequelize.TEXT,
                defaultValue: ""
            },
            keywords: {
                type: Sequelize.TEXT,
                defaultValue: ""
            },
            x: {
                type: Sequelize.DOUBLE,
                defaultValue: 0
            },
            y: {
                type: Sequelize.DOUBLE,
                defaultValue: 0
            },
            z: {
                type: Sequelize.DOUBLE,
                defaultValue: 0
            },
            sharing: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            brainAreaId: {
                type: Sequelize.UUID,
                references: {
                    model: "BrainAreas",
                    key: "id"
                }
            },
            injectionId: {
                type: Sequelize.UUID,
                references: {
                    model: "Injections",
                    key: "id"
                }
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
            deletedAt: Sequelize.DATE
        });
        yield queryInterface.addIndex("Neurons", ["brainAreaId"]);
        yield queryInterface.addIndex("Neurons", ["injectionId"]);
    }),
    down: (queryInterface, Sequelize) => __awaiter(this, void 0, void 0, function* () {
        yield queryInterface.dropTable("Neurons");
        yield queryInterface.dropTable("Injections");
        yield queryInterface.dropTable("RegistrationTransforms");
        yield queryInterface.dropTable("Samples");
        yield queryInterface.dropTable("MouseStrains");
        yield queryInterface.dropTable("BrainAreas");
        yield queryInterface.dropTable("InjectionViruses");
        yield queryInterface.dropTable("Fluorophores");
    })
};
//# sourceMappingURL=20170310223354-initialize.js.map