export declare const TableName = "InjectionVirus";
export interface IInjectionVirus {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    getInjections(): any;
}
export declare function sequelizeImport(sequelize: any, DataTypes: any): any;
