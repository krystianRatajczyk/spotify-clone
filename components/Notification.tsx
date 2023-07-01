import { notificationState } from "@/constants/initialStates";
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface NotificationProps {
  message: string;
  color?: string;
  setNotification: React.Dispatch<React.SetStateAction<notificationState>>;
}

const Notification: React.FC<NotificationProps> = ({
  color,
  message,
  setNotification,
}) => {
  const [animation, setAnimation] = useState<string>("");

  useEffect(() => {
    const animationTimeout = setTimeout(() => {
      setAnimation("hide");
    }, 1500);
    const notificationTimeout = setTimeout(() => {
      setNotification({ message: "", color: "" });
    }, 1850);
    return () => {
      clearTimeout(animationTimeout);
      clearTimeout(notificationTimeout);
    };
  }, []);

  return (
    <div className={`fixed inset-0 flex mx-auto z-50 flex-col `}>
      <div
        className={twMerge(
          `px-4 py-1 
          self-center 
          absolute 
          bottom-[100px] 
          rounded-md 
          bg-blue 
          text-white 
          font-semibold
          ${"animate-" + animation}`,
          color
        )}
      >
        {message}
      </div>
    </div>
  );
};

export default Notification;
