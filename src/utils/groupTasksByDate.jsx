export function groupTasksByDate(tasks) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7));

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);


    const month = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const groups = {
        today: [],
        tomorrow: [],
        week: [],
        month: [],
        later: []
    };

    tasks.forEach(task => {
        if(!task.dueDate) {
            groups.later.push(task);
            return;
        };


            const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);

    if(due.getTime() === today.getTime()){
        groups.today.push(task);
    }else if(due.getTime() === tomorrow.getTime()){
        groups.tomorrow.push(task);
    }else if (due >= startOfWeek && due <= endOfWeek) {
            groups.week.push(task);
    }else if(
        due.getMonth() === today.getMonth() &&
        due.getFullYear() === today.getFullYear()
    ){
        groups.month.push(task);
    } else {
        groups.later.push(task);
    }
    }
    )

    return groups;

    
}