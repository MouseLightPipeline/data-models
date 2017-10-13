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
const Sequelize = require("sequelize");
const Umzug = require("umzug");
function migrateSampleDatabase(connectionOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const location = path.normalize(path.join(__dirname, "../sample/migrations"));
        return migrate(connectionOptions, location);
    });
}
exports.migrateSampleDatabase = migrateSampleDatabase;
function migrate(connectionOptions, migrationPath) {
    return __awaiter(this, void 0, void 0, function* () {
        let sequelize = null;
        if (connectionOptions.uri) {
            sequelize = new Sequelize(connectionOptions.uri);
        }
        else {
            sequelize = new Sequelize(connectionOptions.database, connectionOptions.username, connectionOptions.password, connectionOptions);
        }
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
                // console.log.apply(null, arguments);
            },
        });
        try {
            const out = yield umzug.up();
            if (out.length === 0) {
                console.log("No migrations were executed, database schema was already up to date.");
            }
        }
        catch (err) {
            console.log("Migration failed.");
            console.log(err);
        }
    });
}
exports.migrate = migrate;
//# sourceMappingURL=migrate.js.map