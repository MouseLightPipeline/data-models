"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const Sequelize = require("sequelize");
function seed(connectionOptions, seedPath, pattern = /\.js$/) {
    const sequelize = new Sequelize(connectionOptions.database, connectionOptions.username, connectionOptions.password, connectionOptions);
    fs.readdirSync(seedPath).filter(file => file.match(pattern)).forEach(file => {
        const seedFile = path.normalize(path.join(seedPath, path.parse(file).name));
        const seeder = require(seedFile);
        seeder.up(sequelize.getQueryInterface(), sequelize.constructor).then(() => {
        }).catch((err) => {
            console.log(err);
        });
    });
}
exports.seed = seed;
//# sourceMappingURL=seed.js.map