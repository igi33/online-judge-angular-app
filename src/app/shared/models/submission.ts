import { ComputerLanguage } from "./computer-language";
import { User } from "./user";
import { Task } from "./task";

export class Submission {
    id: number;
    timeSubmitted: any;
    sourcecode: string;
    status: string;
    message: string;
    executionTime: number;
    executionMemory: number;
    user: User;
    task: Task;
    langId: number;
    computerLanguage: ComputerLanguage;
}
