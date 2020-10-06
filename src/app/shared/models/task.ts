import { User } from "./User";
import { TestCase } from "./test-case";
import { Tag } from "./tag";

export class Task {
    id: number;
    name: string;
    description: string;
    memoryLimit: number;
    timeLimit: number;
    timeSubmitted: any;
    origin: string;
    user: User;
    testCases: TestCase[];
    tags: Tag[];

    public constructor(init?: Partial<Task>) {
        Object.assign(this, init);
    }
}
