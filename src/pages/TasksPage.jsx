import { useState, useEffect, useMemo } from "react";
import TaskList from "../components/TaskList";
import Card from "../components/Card";
import { AnimatePresence, LayoutGroup, motion as Motion } from "framer-motion";
import keycloak from "../auth/keycloak";
import SideMenu from "../components/SideMenu";
import { useTaskBoardPreferences } from "../hooks/useTaskBoardPreferences";
import { useTasksData } from "../hooks/useTasksData";
import { createDraftTask } from "../utils/createDraftTask";


export default function TasksPage() {

    const [activeDraft, setActiveDraft] = useState(null);

    const [menuOpen, setMenuOpen] = useState(false);
    const [useCompactGrid, setUseCompactGrid] = useState(false);


    const userId = keycloak.tokenParsed.preferred_username;
    const {
        sectionVisibility,
        priorityVisibility,
        visiblePendingSections,
        handleToggleSection,
        handleTogglePriority
    } = useTaskBoardPreferences(userId);

    const {
        completed,
        grouped,
        isInitialLoading,
        loadTasks,
        handleCreateTask,
        handleOnComplete,
        handleOnDelete,
        handleOnUpdate
    } = useTasksData({
        onTaskCreated: () => setActiveDraft(null)
    });

    const filteredCompletedTasks = useMemo(() => {
        return completed.filter((task) => priorityVisibility[task.priority]);
    }, [completed, priorityVisibility]);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

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
        if (!activeDraft) {
            setActiveDraft({
                group,
                task: createDraftTask(group)
            });
        }
    }

    function cancelDraft() {
        setActiveDraft(null);
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
        if (activeDraft?.group === sectionKey) return null;

        const isBlocked = activeDraft && activeDraft.group !== sectionKey;

        return (
            <button
                disabled={isBlocked}
                onClick={() => startDraft(sectionKey)}
                className={`text-sm transition-all duration-200
                opacity-0 group-hover/card:opacity-100
                ${isBlocked
                        ? "line-through"
                        : "hover:underline"
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
            <Motion.div
                key={sectionKey}
                custom={visiblePendingSections.indexOf(sectionKey)}
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
                            ...(activeDraft?.group === sectionKey ? [activeDraft.task] : [])
                        ]}
                        onDelete={handleOnDelete}
                        onCloseDraft={cancelDraft}
                        onComplete={handleOnComplete}
                        onUpdate={handleOnUpdate}
                        onCreate={handleCreateTask}
                    />
                    <div className=" h-5 mt-1">{renderAddTaskButton(sectionKey)}</div>
                </Card>
            </Motion.div>
        );
    }

    return (
        <>
            <SideMenu
                isOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
                userName={keycloak?.tokenParsed?.preferred_username}
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
                        {isInitialLoading ? (
                            <div className="py-8 text-center text-white/80">Cargando tareas...</div>
                        ) : (
                            <>
                        {/* ================== PENDIENTES ================== */}
                        <Motion.div
                            className={`grid w-full gap-6 ${useCompactGrid ? "grid-cols-[repeat(auto-fit,minmax(280px,1fr))]" : "grid-cols-[repeat(auto-fit,minmax(320px,1fr))]"}`}
                        >
                            <AnimatePresence mode="popLayout">
                                {renderPendingSection("today", "Hoy")}
                                {renderPendingSection("tomorrow", "Mañana")}
                                {renderPendingSection("week", "Esta semana")}
                                {renderPendingSection("month", "Este mes")}
                                {renderPendingSection("later", "Sin fecha o más adelante")}

                            </AnimatePresence>
                        </Motion.div>

                        {sectionVisibility.completed && (
                            <div className="w-full max-w-125 mb-6 pr-1 pb-1">
                                <Card title="Tareas completadas" tone="muted">
                                    <TaskList
                                        onDelete={handleOnDelete}
                                        onComplete={handleOnComplete}
                                        onUpdate={handleOnUpdate}
                                        tasks={filteredCompletedTasks}
                                    />
                                </Card>
                            </div>
                        )}
                            </>
                        )}

                    </div>
                </LayoutGroup>
            </div>

        </>
    );
}
