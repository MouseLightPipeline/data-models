import {SampleConnector} from "../src/connector/sample";

const options = {
    database: "samples_development",
    username: "postgres",
    password: "pgsecret",
    host: "localhost",
    port: 5432,
    dialect: "postgres",
    logging: null
};

const connector = new SampleConnector(options);

test("find all samples", async () => {
    expect.assertions(1);

    await connector.authenticate();

    const objs = await connector.models.Sample.findAll({});

    expect(objs.length > 0).toBe(true);
});

test("test auto id assign", async () => {
    expect.assertions(1);

    const obj = await connector.models.Sample.createFromInput({});

    expect(obj.idNumber).toBe(2);

    await connector.models.Sample.destroy({where: {id: obj.id}, force: true});
});
