import { startOfWeek } from "date-fns";

export function groupTasksByDate(tasks) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const startWeek = startOfWeek(today, { weekStartsOn: 1 });

    const endOfWeek = new Date(startWeek);
    endOfWeek.setDate(startWeek.getDate() + 6);

    const groups = {
        today: [],
        tomorrow: [],
        week: [],
        month: [],
        later: []
    };

    tasks.forEach(task => {
        if (!task.dueDate) {
            groups.later.push(task);
            return;
        };


        const due = new Date(task.dueDate);
        due.setHours(0, 0, 0, 0);

        if (due.getTime() === today.getTime()) {
            groups.today.push(task);
        } else if (due.getTime() === tomorrow.getTime()) {
            groups.tomorrow.push(task);
        } else if (due >= startWeek && due <= endOfWeek) {
            groups.week.push(task);
        } else if (
            due.getMonth() === today.getMonth() &&
            due.getFullYear() === today.getFullYear()
        ) {
            groups.month.push(task);
        } else {
            groups.later.push(task);
        }
    }
    )

    return groups;


}