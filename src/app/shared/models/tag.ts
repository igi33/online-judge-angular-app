export class Tag {
    id: number;
    name: string;
    description: string;

    public constructor(init?: Partial<Tag>) {
        Object.assign(this, init);
    }
}
