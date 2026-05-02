import { motion, type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";

interface Props extends Omit<HTMLMotionProps<"div">, "children"> {
    children: ReactNode;
    delay?: number;
    className?: string;
}

export const AnimatedCard = ({ children, delay = 0, className = "", ...rest }: Props) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -2 }}
            className={className}
            {...rest}
        >
            {children}
        </motion.div>
    );
};
