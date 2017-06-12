import * as path from "path";
import {createSampleConnector} from "./support/mockDatabase";
import {SampleConnector} from "../lib/connector/sample";
import {seedFile} from "../lib/services/seed";

let connector: SampleConnector = null;

beforeAll(async () => {
    connector = await createSampleConnector();

    await seedFile(connector.connection, path.normalize(path.join(__dirname, "./seeders/sampleDefault")));
});

test("find all neurons", async () => {
    expect.assertions(1);

    await connector.authenticate();

    const objs = await connector.models.Neuron.findAll({});

    expect(objs.length === 0).toBe(true);
});

test("test create and update", async () => {
    expect.assertions(18);

    const obj1 = await connector.models.Neuron.createFromInput({
        injectionId: "de39385c-6628-4430-b31d-fcd24ca7df8a",
        sampleId: "2503a1d3-9012-469c-b59d-231402b6b951"
    });

    expect(obj1.injectionId).toBe("de39385c-6628-4430-b31d-fcd24ca7df8a");
    expect(obj1.brainAreaId).toBeNull();
    expect(obj1.idString).toBe("");
    expect(obj1.idNumber).toBe(0);
    expect(obj1.x).toBe(0);
    expect(obj1.y).toBe(0);
    expect(obj1.z).toBe(0);

    const obj2 = await connector.models.Neuron.createFromInput({
        injectionId: "de39385c-6628-4430-b31d-fcd24ca7df8a",
        brainAreaId: "761814c9-df48-4e1e-8d82-194037871dfa",
        sampleId: "2503a1d3-9012-469c-b59d-231402b6b951",
        idString: "AA0001",
        idNumber: 5,
        x: 2.1,
        y: 3.2,
        z: -4.3
    });

    expect(obj2.injectionId).toBe("de39385c-6628-4430-b31d-fcd24ca7df8a");
    expect(obj2.brainAreaId).toBe("761814c9-df48-4e1e-8d82-194037871dfa");
    expect(obj2.idString).toBe("AA0001");
    expect(obj2.idNumber).toBe(5);
    expect(obj2.x).toBe(2.1);
    expect(obj2.y).toBe(3.2);
    expect(obj2.z).toBe(-4.3);

    // Can create with empty, but not update to empty idString
    try {
        await connector.models.Neuron.updateFromInput({id: obj2.id, idString: ""});
    } catch (e) {
        expect(e).toBeDefined();
    }

    // Fail duplicate check
    try {
        await connector.models.Neuron.updateFromInput({id: obj1.id, idString: "AA0001"});
    } catch (e) {
        expect(e).toBeDefined();
    }

    // Proper change
    const obj1Update = await connector.models.Neuron.updateFromInput({id: obj1.id, idString: "AA0002"});
    expect(obj1Update.idString).toBe("AA0002");

    await connector.models.Neuron.destroy({truncate: true, force: true});

    expect(await connector.models.Neuron.count()).toBe(0);
});
