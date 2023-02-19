export class Task {
    id: number = 0;
    task_name: string = '';
    isCompleted: boolean | undefined;
    taskType!: number | undefined;
    taskCreatedDate!: string | undefined;
    taskDueDate!: string | undefined;
    attachment!: any | undefined;
}
