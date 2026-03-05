/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/purity */
/* eslint-disable react-hooks/immutability */
import { useState, useEffect, useMemo, useRef } from "react";
import TaskList from "../components/TaskList";
import { createTask, deleteTask, getCompletedTasks, getPendingTasks, toggleTaskComplete, updateTask } from "../api/api";
import { groupTasksByDate } from "../utils/groupTasksByDate";
import Card from "../components/Card";
import { useLocation } from "react-router-dom";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import keycloak from "../auth/keycloak";
import SideMenu from "../components/SideMenu";

const DEFAULT_SECTION_VISIBILITY = {
    today: true,
    tomorrow: true,
    week: true,
    month: true,
    later: true,
    completed: true
};

const DEFAULT_PRIORITY_VISIBILITY = {
    Baja: true,
    Media: true,
    Alta: true
};

function useVisibilityFilter(storageKey, defaults) {
    const [visibility, setVisibility] = useState(() => {
        try {
            const raw = localStorage.getItem(storageKey);
            if (!raw) return defaults;
            const parsed = JSON.parse(raw);
            return { ...defaults, ...parsed };
        } catch (err) {
            return defaults;
        }
    });

    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(visibility));
    }, [storageKey, visibility]);

    function toggleVisibility(key) {
        setVisibility((current) => ({
            ...current,
            [key]: !current[key]
        }));
    }

    return [visibility, toggleVisibility];
}


export default function TasksPage() {

    const [completed, setCompleted] = useState([]);
    const latestLoadRequestRef = useRef(0);

    const [grouped, setGrouped] = useState({
        today: [],
        tomorrow: [],
        week: [],
        month: [],
        later: []
    });
    const [activeDraft, setActiveDraft] = useState(null);

    const location = useLocation();
    const [name, setName] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [useCompactGrid, setUseCompactGrid] = useState(false);


    const userId = keycloak?.tokenParsed?.preferred_username || "anonymous";
    const sectionStorageKey = `task:sectionVisibility:${userId}`;
    const priorityStorageKey = `task:priorityVisibility:${userId}`;
    const [sectionVisibility, handleToggleSection] = useVisibilityFilter(sectionStorageKey, DEFAULT_SECTION_VISIBILITY);
    const [priorityVisibility, handleTogglePriority] = useVisibilityFilter(priorityStorageKey, DEFAULT_PRIORITY_VISIBILITY);

    const visiblePendingSections = useMemo(() => {
        const orderedSections = ["today", "tomorrow", "week", "month", "later"];
        return orderedSections.filter((section) => sectionVisibility[section]);
    }, [sectionVisibility]);

    function getAnimationIndex(sectionKey) {
        const index = visiblePendingSections.indexOf(sectionKey);
        return index === -1 ? 0 : index;
    }




    useEffect(() => {
        const tname = location?.state?.name || keycloak?.tokenParsed?.preferred_username || "Usuario";
        setName(tname);
        loadTasks();
    }, [location?.state?.name]);

    useEffect(() => {
        let timer;

        if (menuOpen) {
            setUseCompactGrid(true);
        } else {
            timer = setTimeout(() => setUseCompactGrid(false), 400);
        }

        return () => clearTimeout(timer);
    }, [menuOpen]);

    function startDraft(group) {
        if (!activeDraft || activeDraft === group) {
            setActiveDraft(group);
        }
    }

    function cancelDraft() {
        setActiveDraft(null);
    }

    function createDraftTask(group) {
        const toInputDate = (date) => {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, "0");
            const dd = String(date.getDate()).padStart(2, "0");
            return `${yyyy}-${mm}-${dd}`;
        };
        const addDays = (date, days) => {
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + days);
            return nextDate;
        };

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endOfWeek = addDays(today, 6 - ((today.getDay() + 6) % 7));
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        let dueDate = "";
        if (group === "today") {
            dueDate = toInputDate(today);
        } else if (group === "tomorrow") {
            dueDate = toInputDate(addDays(today, 1));
        } else if (group === "week") {
            const firstWeekCandidate = addDays(today, 2);
            dueDate = firstWeekCandidate <= endOfWeek ? toInputDate(firstWeekCandidate) : "";
        } else if (group === "month") {
            const firstMonthCandidate = addDays(endOfWeek, 1);
            dueDate = firstMonthCandidate <= endOfMonth ? toInputDate(firstMonthCandidate) : "";
        }

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

    async function loadTasks() {
        const requestId = ++latestLoadRequestRef.current;
        const [pendingTasks, completedTasks] = await Promise.all([
            getPendingTasks(),
            getCompletedTasks()
        ]);

        if (requestId !== latestLoadRequestRef.current) return;

        setGrouped(groupTasksByDate(pendingTasks));
        setCompleted(completedTasks);
    }

    async function handleCreateTask(task) {
        await createTask(task);
        setActiveDraft(null);

        await loadTasks();
    }

    async function handleOnToggle(id) {
        await toggleTaskComplete(id);
        await loadTasks();
    }

    async function handleOnDelete(id) {
        const ok = window.confirm("¿Estás seguro de que deseas eliminar esta tarea?");
        if (!ok) return;

        await deleteTask(id);
        await loadTasks();
    }

    async function handleOnUpdate(id, task) {
        await updateTask(id, task);
        await loadTasks();
    }

    const cardVariants = {
        hidden: { opacity: 0, y: -40 },
        show: (index = 0) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0, 0, 0.2, 1],
                delay: 0.05 + index * 0.12
            }
        })
    };

    function renderAddTaskButton(sectionKey) {
        if (activeDraft === sectionKey) return null;

        const isBlocked = activeDraft && activeDraft !== sectionKey;

        return (
            <button
                disabled={isBlocked}
                onClick={() => startDraft(sectionKey)}
                className={`text-sm text-[--color-muted] transition-all duration-200
                opacity-0 pointer-events-none group-hover/card:opacity-100
                ${isBlocked
                    ? "line-through cursor-not-allowed"
                    : "hover:underline group-hover/card:pointer-events-auto"
                }`}
            >
                añadir tarea
            </button>
        );
    }

    function renderPendingSection(sectionKey, title) {
        if (!sectionVisibility[sectionKey]) return null;

        const filteredTasks = grouped[sectionKey].filter((task) => priorityVisibility[task.priority]);

        return (
            <motion.div
                key={sectionKey}
                custom={getAnimationIndex(sectionKey)}
                variants={cardVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
                layout="position"
                className="mb-6"
            >
                <Card title={title}>
                    <TaskList
                        tasks={[
                            ...filteredTasks,
                            ...(activeDraft === sectionKey ? [createDraftTask(sectionKey)] : [])
                        ]}
                        onDelete={handleOnDelete}
                        onCloseDraft={cancelDraft}
                        onToggle={handleOnToggle}
                        onUpdate={handleOnUpdate}
                        onCreate={handleCreateTask}
                    />
                    <div className=" h-5 mt-1">{renderAddTaskButton(sectionKey)}</div>
                </Card>
            </motion.div>
        );
    }

    const filteredCompletedTasks = completed.filter((task) => priorityVisibility[task.priority]);


    return (
        <>
            <SideMenu
                isOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
                userName={name}
                sectionVisibility={sectionVisibility}
                onToggleSection={handleToggleSection}
                priorityVisibility={priorityVisibility}
                onTogglePriority={handleTogglePriority}
            ></SideMenu>

            <div
                className={`h-full overflow-y-auto overflow-x-hidden transition-all duration-400 ease-out ${menuOpen ? "ml-64" : "ml-0"}`}
                style={{ scrollbarGutter: "stable" }}
            >
                <div className="mb-8">
                    <button
                        type="button"
                        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="relative grid h-10 w-10 place-items-center rounded-md text-white/90 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    >
                        <div className="flex w-6 flex-col gap-1.5">
                            <span className={`h-0.5 w-6 origin-left rounded bg-current transition-transform duration-300 ${menuOpen ? "scale-x-0" : "scale-x-100"}`} />
                            <span className={`h-0.5 w-6 origin-left rounded bg-current transition-transform duration-300 ${menuOpen ? "scale-x-0" : "scale-x-100"}`} />
                            <span className={`h-0.5 w-6 origin-left rounded bg-current transition-transform duration-300 ${menuOpen ? "scale-x-0" : "scale-x-100"}`} />
                        </div>
                    </button>
                </div>
                <LayoutGroup id="tasks-board">
                <div >
                    {/* ================== PENDIENTES ================== */}
                    <motion.div
                        className={`grid w-full gap-6 ${useCompactGrid ? "grid-cols-[repeat(auto-fit,minmax(280px,1fr))]" : "grid-cols-[repeat(auto-fit,minmax(320px,1fr))]"}`}
                    >
                        <AnimatePresence mode="popLayout">
                        {renderPendingSection("today", "Hoy")}
                        {renderPendingSection("tomorrow", "Mañana")}
                        {renderPendingSection("week", "Esta semana")}
                        {renderPendingSection("month", "Este mes")}
                        {renderPendingSection("later", "Sin fecha o más adelante")}

                    </AnimatePresence>
                    </motion.div>

                    {sectionVisibility.completed && (
                        <div className="w-full max-w-125 mb-6 pr-1 pb-1">
                            <Card title="Tareas completadas" tone="muted">
                                <TaskList
                                    onDelete={handleOnDelete}
                                    onToggle={handleOnToggle}
                                    onUpdate={handleOnUpdate}
                                    tasks={filteredCompletedTasks}
                                />
                            </Card>
                        </div>
                    )}

                </div>
                </LayoutGroup>
            </div>

        </>
    );
}
