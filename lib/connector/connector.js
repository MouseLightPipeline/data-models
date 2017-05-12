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
const Sequelize = require("sequelize");
const modelLoader_1 = require("./modelLoader");
const debug = require("debug")("ndb:data-models:connector");
class Connector {
    constructor(connectionOptions, modelNamespaces) {
        this._name = connectionOptions.database;
        this._connection = new Sequelize(connectionOptions.database, connectionOptions.username, connectionOptions.password, connectionOptions);
        this._models = modelLoader_1.loadModels(this._connection, modelNamespaces);
        this._isConnected = false;
    }
    authenticate() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._connection.authenticate();
                this._isConnected = true;
                debug(`successful database connection: ${this._name}`);
            }
            catch (err) {
                debug(`failed database connection: ${this._name}`);
                debug(err);
                setTimeout(() => this.authenticate(), 5000);
            }
        });
    }
}
exports.Connector = Connector;
//# sourceMappingURL=connector.js.map