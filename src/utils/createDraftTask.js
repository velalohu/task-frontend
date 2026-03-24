import { addDays, endOfMonth, endOfWeek, format, startOfDay } from "date-fns";

export function createDraftTask(group) {
    const today = startOfDay(new Date());
    const dueDateByGroup = {
        today,
        tomorrow: addDays(today, 1),
        week: endOfWeek(today, { weekStartsOn: 1 }),
        month: endOfMonth(today)
    };

    const dueDateSource = dueDateByGroup[group];
    const dueDate = format(dueDateSource, "yyyy-MM-dd");

    return {
        id: `draft-${group}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: "",
        description: "",
        dueDate,
        priority: "Media",
        completed: false,
        isDraft: true
    };
}
