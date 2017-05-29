import * as uuid from "uuid";

export = {
    up: async (queryInterface: any, Sequelize: any) => {
        const when = new Date();

        await queryInterface.bulkInsert("Fluorophores", loadFluorophores(when), {});
        await queryInterface.bulkInsert("MouseStrains", loadMouseStrains(when), {});
        await queryInterface.bulkInsert("InjectionViruses", loadInjectionViruses(when), {});
    },

    down: async (queryInterface: any, Sequelize: any) => {
        await queryInterface.bulkDelete("Fluorophores", null, {});
        await queryInterface.bulkDelete("MouseStrains", null, {});
        await queryInterface.bulkDelete("InjectionViruses", null, {});
    }
};

function loadMouseStrains(when: Date) {
    return [{id: uuid.v4(), name: "C57BL/6J", updatedAt: when, createdAt: when}];
}

function loadInjectionViruses(when: Date) {
    return [{
        id: uuid.v4(),
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
        id: uuid.v4(),
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
