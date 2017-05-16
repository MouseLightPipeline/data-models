import {isNull, isUndefined} from "util";

export function isNullOrEmpty(str: string): boolean {
    return !str && !isUndefined(str);
}
