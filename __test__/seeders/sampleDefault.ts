import * as uuid from "uuid";

export = {
    up: async (queryInterface: any, Sequelize: any) => {
        const when = new Date();

        await queryInterface.bulkInsert("MouseStrains", loadMouseStrains(when), {});
        await queryInterface.bulkInsert("Fluorophores", loadFluorophores(when), {});
        await queryInterface.bulkInsert("InjectionViruses", loadInjectionViruses(when), {});
        await queryInterface.bulkInsert("BrainAreas", loadBrainAreas(when), {});
        await queryInterface.bulkInsert("Samples", loadSamples(when), {});
        await queryInterface.bulkInsert("Injections", loadInjections(when), {});
    },

    down: async (queryInterface: any, Sequelize: any) => {
        await queryInterface.bulkDelete("Injections", null, {});
        await queryInterface.bulkDelete("Samples", null, {});
        await queryInterface.bulkDelete("Fluorophores", null, {});
        await queryInterface.bulkDelete("InjectionViruses", null, {});
        await queryInterface.bulkDelete("BrainAreas", null, {});
        await queryInterface.bulkDelete("MouseStrains", null, {});
    }
};

function loadMouseStrains(when: Date) {
    return [{
        id: "253090ee-9c85-4b3f-937a-b938e5f2f551",
        name: "C57BL/6J",
        updatedAt: when,
        createdAt: when
    }];
}

function loadInjectionViruses(when: Date) {
    return [{
        id: "e0c3c9f9-e8e4-4180-b1d3-6f5d459b5172",
        name: "AAV2/1.FLEX-eGFP",
        updatedAt: when,
        createdAt: when
    }, {
        id: uuid.v4(),
        name: "AAV2/1.FLEX-tdTomato",
        updatedAt: when,
        createdAt: when
    }];
}

function loadFluorophores(when: Date) {
    return [{
        id: "157dafd0-cf93-460c-b9ce-be0ecc062aef",
        name: "eGFP",
        updatedAt: when,
        createdAt: when
    }, {
        id: uuid.v4(),
        name: "tdTomato",
        updatedAt: when,
        createdAt: when
    }];
}

function loadSamples(when: Date) {
    return [{
        id: "2503a1d3-9012-469c-b59d-231402b6b951",
        idNumber: 1,
        tag: "Test Sample",
        animalId: "632563",
        sampleDate: when,
        mouseStrainId: "253090ee-9c85-4b3f-937a-b938e5f2f551",
        comment: "Comments",
        updatedAt: when,
        createdAt: when
    }];
}

function loadInjections(when: Date) {
    return [{
        id: "de39385c-6628-4430-b31d-fcd24ca7df8a",
        injectionVirusId: "e0c3c9f9-e8e4-4180-b1d3-6f5d459b5172",
        fluorophoreId: "157dafd0-cf93-460c-b9ce-be0ecc062aef",
        brainAreaId: "761814c9-df48-4e1e-8d82-194037871dfa",
        sampleId: "2503a1d3-9012-469c-b59d-231402b6b951",
        updatedAt: when,
        createdAt: when
    }];
}

function loadBrainAreas(when: Date) {
    const obj = rootBrainArea;

    return [{
        id: "761814c9-df48-4e1e-8d82-194037871dfa",
        structureId: obj.id,
        atlasId: obj.atlas_id,
        graphId: obj.graph_id,
        graphOrder: obj.graph_order,
        hemisphereId: obj.hemisphere_id,
        depth: obj.depth,
        parentStructureId: obj.parent_structure_id,
        structureIdPath: obj.structure_id_path,
        name: obj.name,
        safeName: obj.safe_name,
        acronym: obj.acronym,
        geometryFile: obj.geometryFile,
        geometryColor: obj.color_hex_triplet,
        geometryEnable: obj.geometryEnable,
        updatedAt: when,
        createdAt: when
    }];
}

const rootBrainArea = {
    acronym: "root",
    atlas_id: -1,
    color_hex_triplet: "FFFFFF",
    depth: 0,
    failed: false,
    failed_facet: 734881840,
    graph_id: 1,
    graph_order: 0,
    hemisphere_id: 3,
    id: 997,
    name: "root",
    neuro_name_structure_id: null as string,
    neuro_name_structure_id_path: null as string,
    ontology_id: 1,
    parent_structure_id: null as string,
    safe_name: "root",
    sphinx_id: 1,
    st_level: null as string,
    structure_id_path: "/997/",
    structure_name_facet: 385153371,
    weight: 8690,
    geometryFile: "root_997.obj",
    geometryEnable: true
};