export class TestCase {
    id: number;
    input: string;
    output: string;

    public constructor(init?: Partial<TestCase>) {
        Object.assign(this, init);
    }
}
