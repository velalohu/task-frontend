import { useCallback, useState } from "react";
import {
    createTask,
    deleteTask,
    getCompletedTasks,
    getPendingTasks,
    toggleTaskComplete,
    updateTask
} from "../api/api";
import { groupTasksByDate } from "../utils/groupTasksByDate";

export function useTasksData({ onTaskCreated } = {}) {
    const [completed, setCompleted] = useState([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [grouped, setGrouped] = useState({
        today: [],
        tomorrow: [],
        week: [],
        month: [],
        later: []
    });

    const loadTasks = useCallback(async () => {
        try {
            const [pendingTasks, completedTasks] = await Promise.all([
                getPendingTasks(),
                getCompletedTasks()
            ]);

            setGrouped(groupTasksByDate(pendingTasks));
            setCompleted(completedTasks);
        } finally {
            setIsInitialLoading(false);
        }
    }, []);

    const handleCreateTask = useCallback(async (task) => {
        await createTask(task);
        onTaskCreated?.();
        await loadTasks();
    }, [loadTasks, onTaskCreated]);

    const handleOnComplete = useCallback(async (id) => {
        await toggleTaskComplete(id);
        await loadTasks();
    }, [loadTasks]);

    const handleOnDelete = useCallback(async (id) => {
        const ok = window.confirm("¿Estás seguro de que deseas eliminar esta tarea?");
        if (!ok) return;

        await deleteTask(id);
        await loadTasks();
    }, [loadTasks]);

    const handleOnUpdate = useCallback(async (id, task) => {
        await updateTask(id, task);
        await loadTasks();
    }, [loadTasks]);

    return {
        completed,
        grouped,
        isInitialLoading,
        loadTasks,
        handleCreateTask,
        handleOnComplete,
        handleOnDelete,
        handleOnUpdate
    };
}
