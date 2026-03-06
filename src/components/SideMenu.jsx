import { AnimatePresence, motion as Motion } from "framer-motion";
import keycloak, { keycloakConfig } from "../auth/keycloak";

export default function SideMenu({isOpen, onClose, userName, sectionVisibility, onToggleSection, priorityVisibility, onTogglePriority}) {
const avatarInitial = (userName?.[0] || "U").toUpperCase();

const handleChangePassword = () => {
    if (typeof keycloak.createAccountUrl === "function") {
        window.location.href = keycloak.createAccountUrl({ redirectUri: window.location.href });
        return;
    }

    const fallbackAccountUrl = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/account`;
    window.location.href = fallbackAccountUrl;
};

const sectionOptions = [
    { key: "today", label: "Hoy" },
    { key: "tomorrow", label: "Mañana" },
    { key: "week", label: "Esta semana" },
    { key: "month", label: "Este mes" },
    { key: "later", label: "Más adelante" },
    { key: "completed", label: "Tareas completadas" }
];

const priorityOptions = ["Baja", "Media", "Alta"];

return(

    <AnimatePresence>
        {isOpen && (
            <>
            <Motion.div
                initial={{ opacity: 0, x: -300}}
                animate={{ opacity: 1, x: 0}}
                exit={{opacity: 0, x: -300}}
                transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
                className="fixed left-0 top-0 z-50 h-screen w-64 border-r border-white/10 bg-cardback p-6 text-white shadow-lg"
            >
                <div className="flex flex-col h-full">
                    <div className="mb-8 border-b border-white/10 pb-5">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[--color-primary] text-white">
                            <span className="text-2xl font-bold"> {avatarInitial} </span>
                        </div>
                        <p className="text-xs uppercase tracking-wide text-white/60">Panel de usuario</p>
                        <h2 className="text-xl font-bold"> {userName || "Usuario"} </h2>
                    </div>

                    <div className="mb-6 rounded-md border border-white/10 p-3">
                        <p className="mb-2 text-xs uppercase tracking-wide text-white/60">Secciones</p>
                        <div className="space-y-2">
                            {sectionOptions.map((section) =>
                            <label key={section.key} className=" flex cursor-pointer items-center gap-2 text-sm text-white/85">
                                <input type="checkbox" checked={Boolean(sectionVisibility[section.key])} onChange={() => onToggleSection(section.key)} className="h-4 w-4 accent-white/70" />
                                <span>{section.label}</span>
                            </label>
                            )}
                            
                        </div>
                    </div>

                    <div className="mb-6 rounded-md border border-white/10 p-3">
                        <p className="mb-2 text-xs uppercase tracking-wide text-white/60">Prioridad</p>
                        <div className="space-y-2">
                            {priorityOptions.map((priority) =>
                            <label key={priority} className="flex cursor-pointer items-center gap-2 text-sm text-white/85">
                                <input type="checkbox" checked={priorityVisibility[priority]} onChange={() => onTogglePriority(priority)} className="h-4 w-4 accent-white/70" />
                                <span>{priority}</span>
                            </label>
                            )}
                        </div>
                    </div>



                    <div className="space-y-2 text-sm text-white/85">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full rounded-md border border-white/10 px-3 py-2 text-left transition-colors hover:bg-white/10"
                        >
                            Volver a tareas
                        </button>
                        <button
                            type="button"
                            onClick={handleChangePassword}
                            className="w-full rounded-md border border-white/10 px-3 py-2 text-left transition-colors hover:bg-white/10"
                        >
                            Cambiar contraseña
                        </button>
                        <button
                            type="button"
                            onClick={() => keycloak.logout({redirectUri: window.location.origin})}
                            className="w-full rounded-md border border-white/10 px-3 py-2 text-left transition-colors hover:bg-white/10"
                        >
                            Cerrar sesion
                        </button>
                    </div>
                </div>
            </Motion.div>
            <Motion.div
                className="fixed inset-0 z-40"
                style={{
                    background: "linear-gradient(to right, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.35) calc(100% - 16px), rgba(0, 0, 0, 0) 100%)"
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >

            </Motion.div>
            </>

        )}
    </AnimatePresence>

)
}