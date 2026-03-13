// Team Logo Generator - Anime/Manga style
// Generuoja komandų logotipus

interface TeamLogoOptions {
  teamId: string;
  teamName: string;
  city: string;
  primaryColor?: string;
}

function seededRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash = hash & hash;
  }
  return () => {
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
  };
}

// Sportinių spalvų paletė
const TEAM_COLORS = [
  '#E74C3C', // Red
  '#3498DB', // Blue
  '#2ECC71', // Green
  '#F39C12', // Orange
  '#9B59B6', // Purple
  '#1ABC9C', // Teal
  '#34495E', // Dark Blue
  '#E91E63', // Pink
  '#FF5722', // Deep Orange
  '#607D8B', // Blue Grey
  '#4CAF50', // Green
  '#FFC107', // Amber
];

function getTeamColors(teamId: string): { primary: string; secondary: string; accent: string } {
  const random = seededRandom(teamId);

  const primary = TEAM_COLORS[Math.floor(random() * TEAM_COLORS.length)];
  const secondary = TEAM_COLORS[Math.floor(random() * TEAM_COLORS.length)];
  const accent = TEAM_COLORS[Math.floor(random() * TEAM_COLORS.length)];

  return { primary, secondary, accent };
}

export function generateTeamLogoSVG(options: TeamLogoOptions): string {
  const colors = getTeamColors(options.teamId);
  const random = seededRandom(options.teamId);

  // Logo styles
  const logoStyles = [
    // Style 1: Shield with ball
    `
      <path d="M30,20 L70,20 L70,40 Q70,60 50,75 Q30,60 30,40 Z" fill="${colors.primary}"/>
      <path d="M30,20 L70,20 L70,25 Q50,35 30,25 Z" fill="${colors.secondary}"/>
      <circle cx="50" cy="45" r="12" fill="${colors.accent}" opacity="0.3"/>
      <ellipse cx="50" cy="45" rx="12" ry="4" fill="none" stroke="${colors.accent}" stroke-width="2"/>
      <line x1="38" y1="45" x2="62" y2="45" stroke="${colors.accent}" stroke-width="2"/>
      <line x1="50" y1="33" x2="50" y2="57" stroke="${colors.accent}" stroke-width="2"/>
    `,
    // Style 2: Circle with letters
    `
      <circle cx="50" cy="50" r="35" fill="${colors.primary}"/>
      <circle cx="50" cy="50" r="28" fill="${colors.secondary}"/>
      <text x="50" y="58" text-anchor="middle" fill="white" font-family="Arial Black, sans-serif" font-size="24" font-weight="bold">
        ${getTeamInitials(options.teamName)}
      </text>
    `,
    // Style 3: Basketball jersey style
    `
      <path d="M25,20 L35,20 L40,35 L40,80 L60,80 L60,35 L65,20 L75,20 L68,40 L70,50 Q50,55 30,50 L32,40 Z" fill="${colors.primary}"/>
      <path d="M35,20 L65,20 L65,25 L35,25 Z" fill="${colors.secondary}"/>
      <circle cx="50" cy="40" r="6" fill="${colors.accent}" opacity="0.5"/>
    `,
    // Style 4: Crest style
    `
      <path d="M50,10 L75,25 L75,50 Q75,70 50,90 Q25,70 25,50 L25,25 Z" fill="${colors.primary}"/>
      <path d="M50,10 L75,25 L50,35 L25,25 Z" fill="${colors.secondary}"/>
      <circle cx="50" cy="50" r="20" fill="white" opacity="0.1"/>
      <text x="50" y="58" text-anchor="middle" fill="white" font-family="serif" font-size="20" font-weight="bold">
        ${getTeamInitials(options.teamName)}
      </text>
    `,
    // Style 5: Dynamic basketball
    `
      <circle cx="50" cy="50" r="38" fill="${colors.primary}"/>
      <circle cx="50" cy="50" r="30" fill="${colors.secondary}" opacity="0.3"/>
      <ellipse cx="50" cy="50" rx="30" ry="4" fill="none" stroke="${colors.accent}" stroke-width="3"/>
      <ellipse cx="50" cy="50" rx="4" ry="30" fill="none" stroke="${colors.accent}" stroke-width="3"/>
      <path d="M35,35 Q50,40 65,35 M35,65 Q50,60 65,65" stroke="${colors.accent}" stroke-width="2" fill="none"/>
    `,
    // Style 6: Star burst
    `
      <polygon points="50,10 61,38 90,38 68,55 77,82 50,70 23,82 32,55 10,38 39,38" fill="${colors.primary}"/>
      <polygon points="50,20 58,40 80,40 62,52 68,70 50,60 32,70 38,52 20,40 42,40" fill="${colors.secondary}"/>
      <text x="50" y="55" text-anchor="middle" fill="white" font-family="Arial Black, sans-serif" font-size="18">
        ${getTeamInitials(options.teamName)}
      </text>
    `,
  ];

  const logoStyle = logoStyles[Math.floor(random() * logoStyles.length)];

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="200" height="200">
  <!-- Background circle -->
  <circle cx="50" cy="50" r="48" fill="#F8F9FA"/>

  ${logoStyle}
</svg>
  `.trim();
}

function getTeamInitials(teamName: string): string {
  // Remove quotes and get initials
  const cleanName = teamName.replace(/["']/g, '');
  const words = cleanName.split(' ');

  if (words.length >= 2) {
    // For "Vilniaus Rytas" -> "VR"
    return (words[0][0] + words[words.length - 1][0]).toUpperCase().slice(0, 3);
  }

  return cleanName.slice(0, 3).toUpperCase();
}

export { getTeamColors };
