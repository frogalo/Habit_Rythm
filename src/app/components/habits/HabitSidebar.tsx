"use client";
import { Pencil, Trash2 } from "lucide-react";
import {getContrastTextColor} from "@/utils/colorUtils";

type HabitSidebarProps = {
    habit: {
        id: string;
        name: string;
        color: string;
    };
    onEdit?: () => void;
    onRemove?: () => void;
};


export default function HabitSidebar({ habit, onEdit, onRemove }: HabitSidebarProps) {
    return (
        <div className="flex flex-col items-center min-w-[40px] mt-3 mr-6 h-[330px] justify-between">
      <span
          className="truncate font-bold text-md px-2 py-1 rounded border max-h-3/5"
          style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              background: habit.color,
              borderColor: habit.color,
              color: getContrastTextColor(habit.color),
              fontFamily: "var(--font-main)",
              textAlign: "center",
              minHeight: "120px",
              display: "inline-block",
          }}
      >
        {habit.name}
      </span>
            <div className="flex flex-col items-center gap-2">
                <button
                    type="button"
                    className="rounded border flex items-center justify-center"
                    style={{
                        background: habit.color,
                        borderColor: habit.color,
                        color: getContrastTextColor(habit.color),
                        cursor: "pointer",
                        width: "34px",
                        height: "34px",
                    }}
                    title="Edit habit"
                    onClick={onEdit}
                >
                    <Pencil size={18} />
                </button>
                <button
                    type="button"
                    className="rounded border flex items-center justify-center"
                    style={{
                        background: habit.color,
                        borderColor: habit.color,
                        color: getContrastTextColor(habit.color),
                        cursor: "pointer",
                        width: "34px",
                        height: "34px",
                    }}
                    title="Remove habit"
                    onClick={onRemove}
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
}
