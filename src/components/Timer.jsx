import React, { useEffect, useRef, useState } from "react";

const Timer = () => {
          const [timeLeft, setTimeLeft] = useState("");
    useEffect(() => {
        const dealDuration = 30 * 60 * 60 * 1000; 
        const endTime = Date.now() + dealDuration;

        const updateCountdown = () => {
            const now = Date.now();
            const diff = endTime - now;

            if (diff <= 0) {
                setTimeLeft("00:00:00");
                return;
            }

            const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
            const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
            const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, "0");

            setTimeLeft(`${hours}:${minutes}:${seconds}`);
        };

        updateCountdown(); // Call immediately
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval); // Cleanup
    }, []);
    return (

    <div>
{timeLeft}
    </div>
  )
}

export default Timer
