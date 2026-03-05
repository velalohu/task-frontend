import TaskItem from "./TaskItem";
import { motion as Motion } from "framer-motion";

export default function TaskList({ tasks, ...handlers }) {
  return (
    <div className="flex flex-col gap-3">
      {tasks.map((task) => {
        const layoutId = task.id 

        return (
          <Motion.div
            key={task.id}
            layout={true}
            layoutId={layoutId}
            className="relative z-10 w-full min-w-0"
            transition={ { layout: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } } }
          >
            <TaskItem task={task} {...handlers} />
          </Motion.div>
        );
      })}
    </div>
  );
}