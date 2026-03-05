export default function Card({ title, children, tone = "default" }) {
  const isMuted = tone === "muted";

  return (
<div className="relative group/card w-full">
  {/* borde desplazado (fondo) */}
  <span className={`pointer-events-none absolute inset-0 translate-x-1 translate-y-1 rounded-xl ${isMuted ? "bg-card" : "bg-cardback"}`} />

  {/* card */}
  <div
      className={`
        relative rounded-xl px-6 py-4
        ${isMuted ? "bg-cardback" : "bg-card"}
        shadow-md
        transition-all duration-150 ease-out
        group-hover/card:translate-x-1
        group-hover/card:translate-y-1
        group-hover/card:shadow-sm
      `}
  >
    {title && (
      <h3 className="mb-2 flex items-center gap-2 font-semibold text-amber-50">
      {title}
      </h3>
    )}

    {children}
  </div>
</div>

  );
}
