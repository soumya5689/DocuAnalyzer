export default function HeroIllustration({
  className = '',
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 900 600"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F5ECFF" />
          <stop offset="100%" stopColor="#EDE9FE" />
        </linearGradient>

        <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0" />
          <stop offset="50%" stopColor="#7C3AED" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
        </linearGradient>

        <filter id="shadow">
          <feDropShadow dx="0" dy="30" stdDeviation="40" floodOpacity="0.25" />
        </filter>

        <filter id="softGlow">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>

      {/* Background */}
      <rect x="30" y="30" width="840" height="540" rx="48" fill="url(#bg)" />

      {/* CENTRAL AI WORKSPACE */}
      <rect
        x="260"
        y="140"
        width="380"
        height="320"
        rx="28"
        fill="#FFFFFF"
        filter="url(#shadow)"
      />

      <text
        x="450"
        y="185"
        textAnchor="middle"
        fontSize="20"
        fontWeight="600"
        fill="#7C3AED"
      >
        AI Intelligence Hub
      </text>

      {/* Workspace rows */}
      <rect x="310" y="215" width="280" height="12" rx="6" fill="#DDD6FE" />
      <rect x="310" y="245" width="240" height="12" rx="6" fill="#DDD6FE" />
      <rect x="310" y="275" width="200" height="12" rx="6" fill="#DDD6FE" />

      {/* Active processing bar */}
      <rect x="310" y="315" width="280" height="14" rx="7" fill="#EDE9FE" />
      <rect x="310" y="315" width="80" height="14" rx="7" fill="#7C3AED">
        <animate
          attributeName="x"
          from="310"
          to="510"
          dur="2.2s"
          repeatCount="indefinite"
        />
      </rect>

      {/* INPUT STREAMS */}
      {/* PDF */}
      <rect
        x="110"
        y="180"
        width="120"
        height="60"
        rx="16"
        fill="#FFFFFF"
        filter="url(#shadow)"
      />
      <text x="170" y="215" textAnchor="middle" fill="#7C3AED" fontWeight="600">
        PDF
      </text>

      {/* Image */}
      <rect
        x="110"
        y="260"
        width="120"
        height="60"
        rx="16"
        fill="#FFFFFF"
        filter="url(#shadow)"
      />
      <text x="170" y="295" textAnchor="middle" fill="#7C3AED">
        Image
      </text>

      {/* Text */}
      <rect
        x="110"
        y="340"
        width="120"
        height="60"
        rx="16"
        fill="#FFFFFF"
        filter="url(#shadow)"
      />
      <text x="170" y="375" textAnchor="middle" fill="#7C3AED">
        Text
      </text>

      {/* INPUT BEAMS */}
      {[
        'M230 210 H260',
        'M230 290 H260',
        'M230 370 H260',
      ].map((d, i) => (
        <path
          key={i}
          d={d}
          stroke="url(#beam)"
          strokeWidth="10"
          fill="none"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="60"
            to="0"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
      ))}

      {/* OUTPUTS */}
      <rect
        x="670"
        y="200"
        width="140"
        height="60"
        rx="16"
        fill="#FFFFFF"
        filter="url(#shadow)"
      />
      <text x="740" y="235" textAnchor="middle" fill="#7C3AED">
        Summary
      </text>

      <rect
        x="670"
        y="280"
        width="140"
        height="60"
        rx="16"
        fill="#FFFFFF"
        filter="url(#shadow)"
      />
      <text x="740" y="315" textAnchor="middle" fill="#7C3AED">
        Insights
      </text>

      <rect
        x="670"
        y="360"
        width="140"
        height="60"
        rx="16"
        fill="#FFFFFF"
        filter="url(#shadow)"
      />
      <text x="740" y="395" textAnchor="middle" fill="#7C3AED">
        Q&A
      </text>

      {/* OUTPUT BEAMS */}
      {[
        'M640 230 H670',
        'M640 310 H670',
        'M640 390 H670',
      ].map((d, i) => (
        <path
          key={i}
          d={d}
          stroke="url(#beam)"
          strokeWidth="10"
          fill="none"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="60"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
      ))}

      {/* AI CORE */}
      <circle cx="450" cy="410" r="18" fill="#7C3AED" filter="url(#softGlow)">
        <animate
          attributeName="r"
          values="16;20;16"
          dur="2.6s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
