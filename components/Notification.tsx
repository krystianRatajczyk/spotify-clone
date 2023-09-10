import { InfoContext } from "@/context/InfoContext";
import { fadeOut } from "@/motion/motion";
import { motion } from "framer-motion";
import React, { useContext, useEffect } from "react";
import { twMerge } from "tailwind-merge";

const Notification = () => {
  const { state, dispatch } = useContext(InfoContext);

  if (state.notification.message == "") return null;

  useEffect(() => {
    const notificationTimeout = setTimeout(() => {
      dispatch({
        type: "SET_NOTIFICATION",
        payload: { display: false },
      });
    }, 1500);
    return () => {
      clearTimeout(notificationTimeout);
    };
  }, [state.notification.message]);

  return (
    <motion.div
      variants={fadeOut()}
      exit="exit"
      className={twMerge(
        `px-4 py-1 
        fixed
        bottom-[100px] 
        left-1/2 
        -translate-x-1/2 
        rounded-md 
        bg-blue 
        z-[1000]
        text-white 
        font-semibold
        `,
        state.notification.color
      )}
    >
      {state.notification.message}
    </motion.div>
  );
};

export default Notification;
