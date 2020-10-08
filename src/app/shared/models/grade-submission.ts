export class GradeSubmission {
    langId: number;
    sourceCode: string;
    timeLimit: number;
    memoryLimit: number;
    input: string;
    expectedOutput: string;

    public constructor(init?: Partial<GradeSubmission>) {
        Object.assign(this, init);
    }
}
