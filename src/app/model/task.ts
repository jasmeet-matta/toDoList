export class Task {
    _id!: number | undefined;
    task_name: string = '';
    isCompleted: boolean | undefined;
    taskType!: number | undefined;
    taskCreatedDate!: string | undefined;
    taskDueDate!: string | undefined;
    attachment!: any | undefined;
}
