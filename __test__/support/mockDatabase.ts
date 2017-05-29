import * as path from "path";
import * as fs from "fs";

import {SampleConnector} from "../../lib/connector/sample";
import {migrateSampleDatabase} from "../../lib/services/migrate";

const testFileStorage = path.normalize(path.join(__dirname, "test.sqlite"));

const SampleDatabaseOptions = {
    database: "samples_development",
    dialect: "sqlite",
    storage: testFileStorage,
    logging: null as any
};

export async function createSampleConnector(): Promise<SampleConnector> {
    if (fs.existsSync(testFileStorage)) {
        fs.unlinkSync(testFileStorage);
    }

    await migrateSampleDatabase(SampleDatabaseOptions);

    const connector = new SampleConnector(SampleDatabaseOptions);

    await connector.authenticate();

    return connector;
}
