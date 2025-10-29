import {
    FileCode2,
    TerminalSquare,
    Boxes,
    Cpu,
    Database,
    Server,
    Code2,
    GitBranch,
    GitCommit,
    GitPullRequest,
    Braces,
    Settings,
    Atom,
    Binary,
    CircuitBoard,
} from "lucide-react";
import { motion } from "framer-motion";

export default function ScrollDevIcons() {
    const icons = [
        FileCode2,
        TerminalSquare,
        Boxes,
        Cpu,
        Database,
        Server,
        Code2,
        GitBranch,
        GitCommit,
        GitPullRequest,
        Braces,
        Settings,
        Atom,
        Binary,
        CircuitBoard,
    ];

    return (
        <motion.div
            className="absolute inset-0 flex flex-wrap items-center justify-center gap-12 p-6 overflow-hidden"
        >

            <div className="absolute inset-0 bg-gray-700/20 mix-blend-multiply pointer-events-none z-10" />

            {[...Array(3)].map((_, layerIndex) => (
                <div className="space-y-10 grid" key={layerIndex}> <div

                    className="grid grid-cols-3 sm:grid-cols-4 gap-10 w-full justify-items-center"
                >
                    {icons.map((Icon, i) => (
                        <motion.div
                            key={`${layerIndex}-${i}`}
                            className={`relative z-0 ${i % 2 === 0 ? "text-red-500" : "text-white"
                                } opacity-90 drop-shadow-[0_0_8px_rgba(255,0,0,0.4)]`}
                            style={{
                                filter: "grayscale(0.2)",
                            }}
                            animate={{
                                y: [0, -10, 0],
                                opacity: [0.8, 1, 0.8],
                                rotate: [0, 6, -6, 0],
                            }}
                            transition={{
                                duration: 5,
                                delay: i * 0.2 + layerIndex * 0.4,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <Icon className="w-10 h-10 md:w-12 md:h-12 mix-blend-overlay" />
                        </motion.div>
                    ))}
                </div></div>
            ))}
        </motion.div>
    );
}
