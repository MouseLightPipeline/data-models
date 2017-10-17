const NeuronsTable = "Neurons";

export = {
    up: async (queryInterface: any, Sequelize: any) => {
        await queryInterface.addColumn(NeuronsTable, "sharing", {type: Sequelize.TEXT});
    },

    down: async (queryInterface: any, Sequelize: any) => {
        await queryInterface.removeColumn(NeuronsTable, "sharing");
    }
}
