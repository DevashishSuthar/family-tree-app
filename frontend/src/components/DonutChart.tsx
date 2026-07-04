import React from 'react';

interface DonutChartProps {
  segments: Array<{ label: string; value: number; colorClassName: string }>;
  size?: number;
  strokeWidth?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({ segments, size = 96, strokeWidth = 14 }) => {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let cumulativeOffset = 0;

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-slate-100 dark:stroke-slate-800"
        />
        {total > 0 &&
          segments.map((segment, index) => {
            const fraction = segment.value / total;
            const dashLength = fraction * circumference;
            const dashArray = `${dashLength} ${circumference - dashLength}`;
            const dashOffset = -cumulativeOffset;
            cumulativeOffset += dashLength;
            return (
              <circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                className={`fill-none transition-all duration-500 ${segment.colorClassName}`}
              />
            );
          })}
      </svg>
      <ul className="space-y-1.5 text-sm">
        {segments.map((segment, index) => (
          <li key={index} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <span className={`h-2.5 w-2.5 rounded-full ${segment.colorClassName.replace('stroke-', 'bg-')}`} />
            {segment.label}
            <span className="font-semibold text-slate-900 dark:text-slate-100">{segment.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
