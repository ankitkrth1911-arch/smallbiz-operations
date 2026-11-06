import React from 'react';

interface WorkflowConnectorProps {
  animated?: boolean;
}

export const WorkflowConnector: React.FC<WorkflowConnectorProps> = ({
  animated = true,
}) => {
  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden lg:block overflow-visible"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Directional Arrow Markers matching Midnight Lighthouse light blue tokens */}
        <marker
          id="arrow-research"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto-start-reverse"
        >
          <path d="M 1 2 L 7 5 L 1 8 z" fill="#7A96C0" />
        </marker>

        <marker
          id="arrow-analysis"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto-start-reverse"
        >
          <path d="M 1 2 L 7 5 L 1 8 z" fill="#5A7AA8" />
        </marker>

        <marker
          id="arrow-sales"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto-start-reverse"
        >
          <path d="M 1 2 L 7 5 L 1 8 z" fill="#A8B8D8" />
        </marker>
      </defs>

      {/* 1. Bridge: Card 01 -> Card 02 (Research #7A96C0 -> Analysis) */}
      <g>
        {/* Main straight bridge */}
        <path
          d="M 24.2% 62 H 25.8%"
          fill="none"
          stroke="#7A96C0"
          strokeWidth="2"
        />
        {/* Curved upper bypass pipe */}
        <path
          d="M 24.2% 62 C 24.7% 44, 25.3% 44, 25.8% 62"
          fill="none"
          stroke="rgba(122, 150, 192, 0.4)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          className="animate-dash-flow"
        />
        {/* Particle along main bridge (warm lamp gold) */}
        {animated && (
          <circle r="2.5" fill="#FFD98A">
            <animateMotion
              dur="1.5s"
              repeatCount="indefinite"
              path="M 24.2% 62 H 25.8%"
            />
          </circle>
        )}
      </g>

      {/* 2. Bridge: Card 02 -> Card 03 (Analysis #5A7AA8 -> Sales) */}
      <g>
        <path
          d="M 49.2% 62 H 50.8%"
          fill="none"
          stroke="#5A7AA8"
          strokeWidth="2"
        />
        <path
          d="M 49.2% 62 C 49.7% 44, 50.3% 44, 50.8% 62"
          fill="none"
          stroke="rgba(90, 122, 168, 0.4)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          className="animate-dash-flow"
        />
        {animated && (
          <circle r="2.5" fill="#FFD98A">
            <animateMotion
              dur="1.5s"
              repeatCount="indefinite"
              path="M 49.2% 62 H 50.8%"
            />
          </circle>
        )}
      </g>

      {/* 3. Bridge: Card 03 -> Card 04 (Sales #A8B8D8 -> Operations) */}
      <g>
        <path
          d="M 74.2% 62 H 75.8%"
          fill="none"
          stroke="#A8B8D8"
          strokeWidth="2"
        />
        <path
          d="M 74.2% 62 C 74.7% 44, 75.3% 44, 75.8% 62"
          fill="none"
          stroke="rgba(168, 184, 216, 0.4)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          className="animate-dash-flow"
        />
        {animated && (
          <circle r="2.5" fill="#FFD98A">
            <animateMotion
              dur="1.5s"
              repeatCount="indefinite"
              path="M 74.2% 62 H 75.8%"
            />
          </circle>
        )}
      </g>

      {/* 4. Upper Ambient Circuit Grid Connector */}
      <g opacity="0.25">
        <path
          d="M 2% -10 H 98%"
          fill="none"
          stroke="#AAB6D0"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
        <path
          d="M 2% -10 V 48"
          fill="none"
          stroke="#AAB6D0"
          strokeWidth="1"
        />
        <path
          d="M 98% -10 V 48"
          fill="none"
          stroke="#AAB6D0"
          strokeWidth="1"
        />
      </g>

      {/* 5. Lower Feedback Bus looping under the cards (#C8D4F0 Operations return) */}
      <g opacity="0.45">
        <path
          d="M 98% 465 C 98% 488, 80% 494, 50% 494 C 20% 494, 2% 488, 2% 465"
          fill="none"
          stroke="#C8D4F0"
          strokeWidth="1.5"
          strokeDasharray="5 7"
          className="animate-dash-flow"
        />
        {animated && (
          <circle r="2" fill="#FFD98A">
            <animateMotion
              dur="4.5s"
              repeatCount="indefinite"
              path="M 98% 465 C 98% 488, 80% 494, 50% 494 C 20% 494, 2% 488, 2% 465"
            />
          </circle>
        )}
      </g>
    </svg>
  );
};
export default WorkflowConnector;
