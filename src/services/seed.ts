import * as path from "path";
import * as fs from "fs";
const Sequelize = require("sequelize");

import {IConnectionOptions} from "../connector/connector";

export function seed(connectionOptions: IConnectionOptions, seedPath: string, pattern: RegExp = /\.js$/) {
    const sequelize = new Sequelize(connectionOptions.database, connectionOptions.username, connectionOptions.password, connectionOptions);

    fs.readdirSync(seedPath).filter(file => file.match(pattern)).forEach(file => {
        const seedFile = path.normalize(path.join(seedPath, path.parse(file).name));

        const seeder: any = require(seedFile);

        seeder.up(sequelize.getQueryInterface(), sequelize.constructor).then(() => {
        }).catch((err: any) => {
            console.log(err);
        });
    });
}
