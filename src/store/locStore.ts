import { ZlklLocation } from "../models/zlklTypes";

export class LocStore {
    private byId = new Map<number, ZlklLocation>();

    loadLocations(loc: ZlklLocation[]) {
        this.byId.clear();

        for (const l of loc) {
            this.byId.set(l.id, l);
        }
    }

    public getById(id: number): ZlklLocation | undefined {
        return this.byId.get(id);
    }
}