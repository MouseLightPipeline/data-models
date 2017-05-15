"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const Sequelize = require("sequelize");
const Umzug = require('umzug');
function migrate(connectionOptions, migrationPath) {
    const sequelize = new Sequelize(connectionOptions.database, connectionOptions.username, connectionOptions.password, connectionOptions);
    const umzug = new Umzug({
        storage: "sequelize",
        storageOptions: {
            sequelize: sequelize,
        },
        migrations: {
            params: [
                sequelize.getQueryInterface(),
                sequelize.constructor,
            ],
            path: migrationPath,
            pattern: /\.js$/
        },
        logging: function () {
            console.log.apply(null, arguments);
        },
    });
    umzug.up().then((out) => {
        if (out.length === 0) {
            console.log("No migrations were executed, database schema was already up to date.");
        }
    }).catch((err) => {
        console.log("Migration failed.");
        console.log(err);
    });
}
exports.migrate = migrate;
//# sourceMappingURL=migrate.js.map