import React, { useEffect } from "react";
import { useState } from "react";

const ProgressRing = (props) => {

    


    const [radius, setRadius] = useState(props.radius);
    const [stroke, setStroke] = useState(props.stroke);


    const [normalizedRadius, setNormalizedRadius] = useState(radius - stroke * 2);
    const [circumference, setCircumference] = useState(normalizedRadius * 2 * Math.PI)

    const [progress, setProgress] = useState(95);
    const [strokeDashoffset, setStrokeDashOffset] = useState(circumference - progress / 100 * circumference);

    const root = document.documentElement;
    root.style.setProperty('--time-range', `${props.timer}ms`);


    const updateProgress = () => {
        setTimeout(() => {
            setStrokeDashOffset(circumference - 0 / 100 * circumference);
        }, 50);
    }

    useEffect(() => {
        updateProgress();
    }, [])




    return (
        <svg
            id='progressring'
            height={radius * 2}
            width={radius * 2}
        >
            <circle
                stroke="black"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                stroke-width={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                
            />
        </svg>
    );

}

export default ProgressRing;