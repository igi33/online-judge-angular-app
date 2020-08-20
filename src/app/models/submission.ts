import { ComputerLanguage } from "./computerlanguage";
import { User } from "./user";
import { Task } from "./task";

export class Submission {
    id: number;
    timesubmitted: any;
    sourcecode: string;
    status: string;
    message: string;
    executiontime: number;
    executionmemory: number;
    user: User;
    task: Task;
    langid: number;
    computerlanguage: ComputerLanguage;
}
