"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocStore = void 0;
class LocStore {
    constructor() {
        this.byId = new Map();
    }
    loadLocations(loc) {
        this.byId.clear();
        for (const l of loc) {
            this.byId.set(l.id, l);
        }
    }
    getById(id) {
        return this.byId.get(id);
    }
}
exports.LocStore = LocStore;
