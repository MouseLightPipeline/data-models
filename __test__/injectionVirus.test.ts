import * as path from "path";
import {createSampleConnector} from "./support/mockDatabase";
import {SampleConnector} from "../lib/connector/sample";
import {seedFile} from "../lib/services/seed";

let connector: SampleConnector = null;

beforeAll(async () => {
    connector = await createSampleConnector();

    await seedFile(connector.connection, path.normalize(path.join(__dirname, "./seeders/sampleDefault")));
});

test("find all injection viruses", async () => {
    expect.assertions(1);

    await connector.authenticate();

    const objs = await connector.models.InjectionVirus.findAll({});

    expect(objs.length).toBe(2);
});

test("find duplicate injection virus", async () => {
    expect.assertions(2);

    let obj = await connector.models.InjectionVirus.findDuplicate("AAV2/1.FLEX-eGFP");

    expect(obj === null).toBe(false);

    obj = await connector.models.InjectionVirus.findDuplicate("AAV2/1.FLEX-eGFP2");

    expect(obj).toBeNull();
});

test("where clause with findOrCreate", async () => {
    expect.assertions(3);

    const ref = await connector.models.InjectionVirus.findDuplicate("AAV2/1.FLEX-eGFP");

    const find = await connector.models.InjectionVirus.findOrCreateFromInput({name: "AAV2/1.FLEX-eGFP"});

    expect(find[0].id).toEqual(ref.id);

    expect(find[1]).toBe(false);

    const create = await connector.models.InjectionVirus.findOrCreateFromInput({name: "AAV2/1.FLEX-eGFP2"});

    expect(create[1]).toBe(true);

    await connector.models.InjectionVirus.destroy({where: {id: create[0].id}, force: true});
});

test("create", async () => {
    expect.assertions(6);

    const obj = await connector.models.InjectionVirus.createFromInput({name: "AAV2/1.FLEX-eGFP3"});

    expect(obj.name).toBe("AAV2/1.FLEX-eGFP3");

    await connector.models.InjectionVirus.destroy({where: {id: obj.id}, force: true});

    // No arguments
    try {
        await connector.models.InjectionVirus.createFromInput();
    } catch (err) {
        expect(err).toBeDefined();
    }

    // Missing name property
    try {
        await connector.models.InjectionVirus.createFromInput({});
    } catch (err) {
        expect(err).toBeDefined();
    }

    // Name null
    try {
        await connector.models.InjectionVirus.createFromInput({name: null});
    } catch (err) {
        expect(err).toBeDefined();
    }

    // Name empty
    try {
        await connector.models.InjectionVirus.createFromInput({name: ""});
    } catch (err) {
        expect(err).toBeDefined();
    }

    // Note case insensitivity
    try {
        await connector.models.InjectionVirus.createFromInput({name: "aav2/1.FLEX-eGFP"});
    } catch (err) {
        expect(err).toBeDefined();
    }
});

test("update", async () => {
    expect.assertions(10);

    // No arguments
    try {
        await connector.models.InjectionVirus.updateFromInput();
    } catch (err) {
        expect(err).toBeDefined();
    }

    // Missing id property
    try {
        await connector.models.InjectionVirus.updateFromInput({});
    } catch (err) {
        expect(err).toBeDefined();
    }

    // Id null
    try {
        await connector.models.InjectionVirus.updateFromInput({id: null});
    } catch (err) {
        expect(err).toBeDefined();
    }

    // Id empty
    try {
        await connector.models.InjectionVirus.updateFromInput({id: ""});
    } catch (err) {
        expect(err).toBeDefined();
    }

    // Row doesn't exist
    try {
        await connector.models.InjectionVirus.updateFromInput({id: "307DB2C1-EF14-4468-8AEE-C0F8292B3F98"});
    } catch (err) {
        expect(err).toBeDefined();
    }

    // Get a real instance for updates
    const obj = await connector.models.InjectionVirus.findOne({where: {name: "AAV2/1.FLEX-eGFP"}});

    expect(obj !== null).toBe(true);

    // Name null
    try {
        await connector.models.InjectionVirus.updateFromInput({id: obj.id, name: null});
    } catch (err) {
        expect(err).toBeDefined();
    }

    // Name empty
    try {
        await connector.models.InjectionVirus.updateFromInput({id: obj.id, name: ""});
    } catch (err) {
        expect(err).toBeDefined();
    }

    // Case insensitive match to existing
    try {
        await connector.models.InjectionVirus.updateFromInput({id: obj.id, name: "AAV2/1.FLEX-tdTomato"});
    } catch (err) {
        expect(err).toBeDefined();
    }

    const upObj = await connector.models.InjectionVirus.updateFromInput({id: obj.id, name: "AAV2/1.FLEX-eGFP4"});

    expect(upObj.name).toBe("AAV2/1.FLEX-eGFP4");

    await connector.models.InjectionVirus.updateFromInput({id: obj.id, name: "AAV2/1.FLEX-eGFP"});
});
