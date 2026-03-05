import { useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import FancyButton from "./FancyButton";

export default function TaskItem({ task, onToggle, onUpdate, onDelete, onCreate, onCloseDraft }) {
  const [editing, setEditing] = useState(task.isDraft || false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [priority, setPriority] = useState(task.priority || "Media");
  const priorityValue = task.priority || "Media";
  const priorityBadgeClass =
    priorityValue === "Alta"
      ? "border-red-400/50 bg-red-500/15 text-red-300"
      : priorityValue === "Media"
        ? "border-orange-400/50 bg-orange-500/15 text-orange-300"
        : "border-yellow-400/50 bg-yellow-500/15 text-yellow-300";
  const iconColor = task.completed ? "bg-cardback" : "";

  async function save() {
    if (title.trim() === "") return;

    if (task.isDraft) {
      await onCreate({ title, description, dueDate, priority }, task.id);
    } else {
      await onUpdate(task.id, { ...task, title, description, dueDate, priority });
      setEditing(false);
    }
  }

  function cancel() {
    if(task.isDraft) {
      setTitle("")
      setDescription("")
      setDueDate("")
      setPriority("Media")
      onCloseDraft();
     
    }else{
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.dueDate)
    setPriority(task.priority || "Media")
    setEditing(false);
    }
  }


  return (
<div className="relative group w-full">
  {/* borde desplazado (fondo) */}
  <span className="pointer-events-none absolute inset-0 rounded-xl bg-cardback" />
    
    <div
    
     
      className={`
        ${task.completed ? "bg-cardback border-gray-500/60" : "bg-card border-gray-400"}
        border
        rounded-xl
        p-4
        flex
        gap-4
        group/taskItem
        
   


              relative  px-6 py-4
      shadow-md
                  transition-all  duration-300 ease-out
      hover:-translate-x-1 hover:-translate-y-1
      hover:shadow-sm
    
                  `}
    >
      
      {/* BOTONES */}
      <div className="flex flex-col gap-2 shrink-0">
        {/* EDITAR */}
        {!editing && (
          <>
            <FancyButton
              color="green"
              onClick={() => onToggle(task.id)}
              className={iconColor}
              icon
            >
              <Check aria-hidden="true" strokeWidth={2.75} />
            </FancyButton>
            <FancyButton
              color="yellow"
              onClick={() => setEditing(true)}
              className={iconColor}
              icon
            >
              <Pencil aria-hidden="true" strokeWidth={2.75} />
            </FancyButton>
          </>

        )}
      </div>

      {/* CONTENIDO */}
      <div className={`flex-1 min-w-0 ${!editing ? "pr-12" : ""}`}>
        {editing ? (
          <div className="flex flex-col">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              className="
                w-full
                bg-transparent
                border border-[--color-border]
                rounded-md
                px-2 py-1
                mb-2
              "
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Detalles"
              className="
                w-full
                bg-transparent
                border border-[--color-border]
                rounded-md
                px-2 py-1
                resize-none
                max-h-40
                overflow-auto
                mb-2
              "
            />
            
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <label className="text-sm text-[--color-muted]">Fecha</label>
              <input
                type="date"
                value={dueDate || ""}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-transparent border border-[--color-border] rounded-md px-2 py-1"
              />

              <label className="text-sm text-[--color-muted]">Prioridad</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="bg-transparent border border-[--color-border] rounded-md px-2 py-1"
              >
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
              </select>
            </div>

            <div className="flex gap-2 mt-auto">
              <FancyButton onClick={save} color="green" disabled={title.trim() === ""}>guardar</FancyButton>
              <FancyButton onClick={cancel} color="red2">cancelar</FancyButton>
            </div>
          </div>
        ) : (
          <>
            <p
              className={`font-medium wrap-anywhere ${task.completed
                  ? "line-through text-[--color-muted]"
                  : ""
                }`}
            >
              {task.title}
            </p>

            <p className="text-sm text-[--color-muted] mt-1 min-h-5 wrap-anywhere">
              {task.description}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[--color-muted]">
              <span>{task.dueDate ? `⏰ ${task.dueDate}` : "⏰ Sin fecha límite"}</span>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] tracking-wide ${priorityBadgeClass}`}>
                {priorityValue}
              </span>
            </div>
          </>
        )}
      </div>
{!editing && (
  <div className="absolute top-3 right-3 z-20">
    <FancyButton
      color="red"
      onClick={() => onDelete(task.id)}
      className={iconColor}
      icon
    >
      <X aria-hidden="true" strokeWidth={2.75} />
    </FancyButton>
  </div>
)}
    </div>
    {/* ELIMINAR */}
{/* ELIMINAR */}



    </div>
  );
}
