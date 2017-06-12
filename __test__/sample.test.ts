import * as path from "path";
import {createSampleConnector} from "./support/mockDatabase";
import {SampleConnector} from "../lib/connector/sample";
import {seedFile} from "../lib/services/seed";

let connector: SampleConnector = null;

beforeAll(async () => {
    connector = await createSampleConnector();

    await seedFile(connector.connection, path.normalize(path.join(__dirname, "./seeders/sampleDefault")));
});

test("find all samples", async () => {
    expect.assertions(1);

    await connector.authenticate();

    const objs = await connector.models.Sample.findAll({});

    expect(objs.length === 1).toBe(true);
});

test("test auto id assign", async () => {
    expect.assertions(1);

    const obj = await connector.models.Sample.createFromInput({});

    expect(obj.idNumber).toBe(2);

    await connector.models.Sample.destroy({where: {id: obj.id}, force: true});
});
