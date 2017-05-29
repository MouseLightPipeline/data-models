import * as path from "path";
import * as Sequelize from "sequelize";
import * as Umzug from "umzug";

import {IConnectionOptions} from "../connector/connector";

export async function migrateSampleDatabase(connectionOptions: IConnectionOptions): Promise<void> {
    const location = path.normalize(path.join(__dirname, "../sample/migrations"));

    return migrate(connectionOptions, location);
}

export async function migrate(connectionOptions: IConnectionOptions, migrationPath: string): Promise<void> {
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
            // console.log.apply(null, arguments);
        },
    });

    try {
        const out = await umzug.up();
        if (out.length === 0) {
            console.log("No migrations were executed, database schema was already up to date.")
        }
    } catch (err) {
        console.log("Migration failed.");
        console.log(err);
    }
}
