import { IConnectionOptions } from "../connector/connector";
export declare function migrateSampleDatabase(connectionOptions: IConnectionOptions): Promise<void>;
export declare function migrate(connectionOptions: IConnectionOptions, migrationPath: string): Promise<void>;
