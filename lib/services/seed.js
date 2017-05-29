"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const Sequelize = require("sequelize");
function seed(connectionOptions, seedPath, pattern = /\.js$/) {
    return __awaiter(this, void 0, void 0, function* () {
        const sequelize = new Sequelize(connectionOptions.database, connectionOptions.username, connectionOptions.password, connectionOptions);
        return Promise.all(fs.readdirSync(seedPath).filter(file => file.match(pattern)).map((file) => __awaiter(this, void 0, void 0, function* () {
            const filename = path.normalize(path.join(seedPath, path.parse(file).name));
            return seedFile(sequelize, filename);
        })));
    });
}
exports.seed = seed;
function seedFile(connection, filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const seeder = require(filename);
        return seeder.up(connection.getQueryInterface(), connection.constructor);
    });
}
exports.seedFile = seedFile;
//# sourceMappingURL=seed.js.map