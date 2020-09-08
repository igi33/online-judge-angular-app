import { User } from "./User";
import { TestCase } from "./test-case";
import { Tag } from "./tag";

export class Task {
    id: number;
    name: string;
    description: string;
    memorylimit: number;
    timelimit: number;
    timesubmitted: any;
    origin: string;
    user: User;
    testcases: TestCase[];
    tags: Tag[];
}
