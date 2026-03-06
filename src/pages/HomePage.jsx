import keycloak from "../auth/keycloak";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";

export default function HomePage(){
    const navigate = useNavigate();
    const [isAuthTransitioning, setIsAuthTransitioning] = useState(false);
    const [gridOffsetSeconds] = useState(() => (Date.now() % 12000) / 1000);
    const redirectUri = `${window.location.origin}/tasks`;
    
    useEffect(() => {
        if (!keycloak?.authenticated) return;
        const name = keycloak?.tokenParsed?.preferred_username || "Usuario";
        navigate("/tasks", { state: { name } });
    }, [navigate])

    function handleLogin() {
        if (isAuthTransitioning) return;
        setIsAuthTransitioning(true);
        window.setTimeout(() => keycloak.login({ redirectUri }), 280);
    }

    function handleRegister() {
        if (isAuthTransitioning) return;
        setIsAuthTransitioning(true);
        window.setTimeout(() => keycloak.register({ redirectUri }), 280);
    }

    return (

        <Motion.div 
        className="relative h-full flex items-center justify-center bg-[#444351]"
        initial={{ opacity: 0, backgroundColor: "#444351" }}
        animate={{
            opacity: 1,
            backgroundColor: isAuthTransitioning ? "#353144" : "#444351"
        }}
        exit={{ opacity: 0}}
        transition={{
            opacity: { duration: 0.6 },
            backgroundColor: { duration: 0.28, ease: "easeOut" }
        }}
        >
            <div aria-hidden className="pointer-events-none absolute inset-0">

                <Motion.div
                    className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-white/20 blur-2xl"
                    style={{ opacity: 0.34 }}
                    animate={{ x: [0, 46, -60, 0], y: [0, -34, 16, 0], scale: [1, 1.1, 0.88, 1] }}
                    transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                />
                <Motion.div
                    className="absolute -inset-20 opacity-[0.12]"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)",
                        backgroundSize: "52px 52px"
                    }}
                    animate={{ x: [0, 24, 0], y: [0, 18, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: -gridOffsetSeconds }}
                />
                <div className="absolute inset-0 bg-linear-to-b from-white/10 via-transparent to-black/20" />
            </div>

            <div className={`relative z-10 text-center max-w-xl transition-opacity duration-200 ${isAuthTransitioning ? "opacity-0" : "opacity-100"}`}>
                <h1 className="text-7xl md:text-8xl font-black tracking-tight text-white">
                    TASKS
                </h1>
                <p className="mt-4 text-base md:text-lg text-white/80">
                    simple and customizable task manager
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                        type="button"
                        disabled={isAuthTransitioning}
                        onClick={handleLogin}
                        className={`w-56 rounded-md px-5 py-3 font-semibold text-white/90 transition-all duration-200 hover:text-white hover:[text-shadow:0_0_12px_rgba(255,255,255,0.9)] ${isAuthTransitioning ? "opacity-70" : ""}`}
                    >
                        Iniciar sesión
                    </button>
                    <button
                        type="button"
                        disabled={isAuthTransitioning}
                        onClick={handleRegister}
                        className={`w-56 rounded-md border border-white/25 bg-white/10 px-5 py-3 font-semibold text-white transition-colors duration-200 hover:bg-white/20 ${isAuthTransitioning ? "opacity-70" : ""}`}
                    >
                        Crear cuenta
                    </button>
                </div>
            </div>
        </Motion.div>

    )
}