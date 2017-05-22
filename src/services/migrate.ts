const fs = require("fs");
const Sequelize = require("sequelize");
const Umzug = require("umzug");

import {IConnectionOptions} from "../connector/connector";

export function migrate(connectionOptions: IConnectionOptions, migrationPath: string) {
    const sequelize = new Sequelize(connectionOptions.database, connectionOptions.username, connectionOptions.password, connectionOptions);

    const umzug = new Umzug({
        storage: "sequelize",
        storageOptions: {
            sequelize: sequelize,
        },

        migrations: {
            params: [
                sequelize.getQueryInterface(), // queryInterface
                sequelize.constructor, // DataTypes
            ],
            path: migrationPath,
            pattern: /\.js$/
        },

        logging: function () {
            console.log.apply(null, arguments);
        },
    });

    umzug.up().then((out: any) => {
        if (out.length === 0) {
            console.log("No migrations were executed, database schema was already up to date.")
        }
    }).catch((err: any) => {
        console.log("Migration failed.");
        console.log(err);
    });
}
