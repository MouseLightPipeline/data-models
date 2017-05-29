import * as path from "path";
import * as fs from "fs";
import * as Sequelize from "sequelize";

import {IConnectionOptions} from "../connector/connector";

export async function seed(connectionOptions: IConnectionOptions, seedPath: string, pattern: RegExp = /\.js$/) {
    const sequelize = new Sequelize(connectionOptions.database, connectionOptions.username, connectionOptions.password, connectionOptions);

    return Promise.all(fs.readdirSync(seedPath).filter(file => file.match(pattern)).map(async (file) => {
        const filename = path.normalize(path.join(seedPath, path.parse(file).name));

        return seedFile(sequelize, filename);
    }));
}

export async function seedFile(connection: Sequelize.Sequelize, filename: string): Promise<void> {
    const seeder: any = require(filename);

    return seeder.up(connection.getQueryInterface(), connection.constructor);
}
