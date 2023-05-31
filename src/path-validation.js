import fs from "fs";

class ValidationResult {
    constructor(valid, stats, error, path) {
        this.ifValid = function (callback) {
            if (valid) {
                callback(path, stats);
            }
            return this;
        };
        this.ifInvalid = function (callback) {
            if (!valid) {
                callback(path, error);
            }
            return this;
        };
    }
}

export function validate(path) {
    try {
        const stats = fs.lstatSync(path);
        return new ValidationResult(true, stats, null, path);
    } catch (error) {
        return new ValidationResult(false, null, error, path);
    }
}
