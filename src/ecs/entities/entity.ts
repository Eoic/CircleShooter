export class Entity {
    private static _id: number = 0;

    constructor() {
        Entity._id++;
    }

    get id() {
        return Entity._id;
    }
}
