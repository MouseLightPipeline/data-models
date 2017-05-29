import * as path from "path";
import {createSampleConnector} from "./support/mockDatabase";
import {SampleConnector} from "../lib/connector/sample";
import {seedFile} from "../lib/services/seed";

let connector: SampleConnector = null;

beforeAll(async () => {
    connector = await createSampleConnector();

    await seedFile(connector.connection, path.normalize(path.join(__dirname, "./seeders/sampleDefault")));
});

test("find all fluorophores", async () => {
    expect.assertions(1);

    const objs = await connector.models.Fluorophore.findAll({});

    expect(objs.length).toBe(2);
});

test("find duplicate fluorophore", async () => {
    expect.assertions(2);

    let obj = await connector.models.Fluorophore.findDuplicate("tdTomato");

    expect(obj === null).toBe(false);

    obj = await connector.models.Fluorophore.findDuplicate("tdTomato2");

    expect(obj).toBeNull();
});

test("where clause with findOrCreate", async () => {
    expect.assertions(3);

    const ref = await connector.models.Fluorophore.findDuplicate("tdTomato");

    const find = await connector.models.Fluorophore.findOrCreateFromInput({name: "tdTomato"});

    expect(find[0].id).toEqual(ref.id);

    expect(find[1]).toBe(false);

    const create = await connector.models.Fluorophore.findOrCreateFromInput({name: "tdTomato2"});

    expect(create[1]).toBe(true);

    await connector.models.Fluorophore.destroy({where: {id: create[0].id}, force: true});
});

test("create", async () => {
    expect.assertions(6);

    const obj = await connector.models.Fluorophore.createFromInput({name: "tdTomato3"});

    expect(obj.name).toBe("tdTomato3");

    await connector.models.Fluorophore.destroy({where: {id: obj.id}, force: true});

    // No arguments
    try {
        await connector.models.Fluorophore.createFromInput();
    } catch (err) {
        expect(err).toBeDefined();
    }

    // Missing name property
    try {
        await connector.models.Fluorophore.createFromInput({});
    } catch (err) {
        expect(err).toBeDefined();
    }

    // Name null
    try {
        await connector.models.Fluorophore.createFromInput({name: null});
    } catch (err) {
        expect(err).toBeDefined();
    }

    // Name empty
    try {
        await connector.models.Fluorophore.createFromInput({name: ""});
    } catch (err) {
        expect(err).toBeDefined();
    }

    // Note case insensitivity
    try {
        await connector.models.Fluorophore.createFromInput({name: "TDtomAto"});
    } catch (err) {
        expect(err).toBeDefined();
    }
});

test("update", async () => {
    expect.assertions(10);

    // No arguments
    try {
        await connector.models.Fluorophore.updateFromInput();
    } catch (err) {
        expect(err).toBeDefined();
    }

    // Missing id property
    try {
        await connector.models.Fluorophore.updateFromInput({});
    } catch (err) {
        expect(err).toBeDefined();
    }

    // Id null
    try {
        await connector.models.Fluorophore.updateFromInput({id: null});
    } catch (err) {
        expect(err).toBeDefined();
    }

    // Id empty
    try {
        await connector.models.Fluorophore.updateFromInput({id: ""});
    } catch (err) {
        expect(err).toBeDefined();
    }

    // Row doesn't exist
    try {
        await connector.models.Fluorophore.updateFromInput({id: "307DB2C1-EF14-4468-8AEE-C0F8292B3F98"});
    } catch (err) {
        expect(err).toBeDefined();
    }

    // Get a real instance for updates
    const obj = await connector.models.Fluorophore.findOne({where: {name: "tdTomato"}});

    expect(obj !== null).toBe(true);

    // Name null
    try {
        await connector.models.Fluorophore.updateFromInput({id: obj.id, name: null});
    } catch (err) {
        expect(err).toBeDefined();
    }

    // Name empty
    try {
        await connector.models.Fluorophore.updateFromInput({id: obj.id, name: ""});
    } catch (err) {
        expect(err).toBeDefined();
    }

    // Case insensitive match to existing
    try {
        await connector.models.Fluorophore.updateFromInput({id: obj.id, name: "egfp"});
    } catch (err) {
        expect(err).toBeDefined();
    }

    const upObj = await connector.models.Fluorophore.updateFromInput({id: obj.id, name: "td2Tomato"});

    expect(upObj.name).toBe("td2Tomato");

    await connector.models.Fluorophore.updateFromInput({id: obj.id, name: "tdTomato"});
});
