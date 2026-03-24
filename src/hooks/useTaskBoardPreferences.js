import { useEffect, useMemo, useState } from "react";

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

export function useTaskBoardPreferences(userId) {
    const sectionStorageKey = `task:sectionVisibility:${userId}`;
    const priorityStorageKey = `task:priorityVisibility:${userId}`;

    const [sectionVisibility, setSectionVisibility] = useState(() => {
        try {
            const raw = localStorage.getItem(sectionStorageKey);
            if (!raw) return DEFAULT_SECTION_VISIBILITY;
            const parsed = JSON.parse(raw);
            return { ...DEFAULT_SECTION_VISIBILITY, ...parsed };
        } catch {
            return DEFAULT_SECTION_VISIBILITY;
        }
    });

    const [priorityVisibility, setPriorityVisibility] = useState(() => {
        try {
            const raw = localStorage.getItem(priorityStorageKey);
            if (!raw) return DEFAULT_PRIORITY_VISIBILITY;
            const parsed = JSON.parse(raw);
            return { ...DEFAULT_PRIORITY_VISIBILITY, ...parsed };
        } catch {
            return DEFAULT_PRIORITY_VISIBILITY;
        }
    });

    const visiblePendingSections = useMemo(() => {
        const orderedSections = ["today", "tomorrow", "week", "month", "later"];
        return orderedSections.filter((section) => sectionVisibility[section]);
    }, [sectionVisibility]);

    useEffect(() => {
        localStorage.setItem(sectionStorageKey, JSON.stringify(sectionVisibility));
    }, [sectionStorageKey, sectionVisibility]);

    useEffect(() => {
        localStorage.setItem(priorityStorageKey, JSON.stringify(priorityVisibility));
    }, [priorityStorageKey, priorityVisibility]);

    function handleToggleSection(key) {
        setSectionVisibility({
            ...sectionVisibility,
            [key]: !sectionVisibility[key]
        });
    }

    function handleTogglePriority(key) {
        setPriorityVisibility({
            ...priorityVisibility,
            [key]: !priorityVisibility[key]
        });
    }

    return {
        sectionVisibility,
        priorityVisibility,
        visiblePendingSections,
        handleToggleSection,
        handleTogglePriority
    };
}
