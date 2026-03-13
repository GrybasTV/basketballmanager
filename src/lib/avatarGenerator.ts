// Anime/Manga Style Avatar Generator
// Generuoja unikalius žaidėjų avatarus be išorinių API

interface PlayerAvatarOptions {
  playerId: string;
  position: string; // PG, SG, SF, PF, C
  ovr: number;
  skinTone?: string;
}

interface AvatarColors {
  hair: string;
  eyes: string;
  skin: string;
  jersey: string;
  background: string;
}

// Spalvų paletės
const SKIN_TONES = ['#F5D0C5', '#E8B4A0', '#D4A574', '#C68642', '#8D5524'];
const HAIR_COLORS = ['#1A1A1A', '#4A3728', '#8B4513', '#D4A574', '#FFD700', '#FF6B6B', '#4ECDC4'];
const EYE_COLORS = ['#2C3E50', '#8B4513', '#3498DB', '#27AE60', '#9B59B6', '#E74C3C'];
const JERSEY_COLORS = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C', '#34495E'];

// Pseudo-random generator (deterministic pagal playerId)
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

function getAvatarColors(options: PlayerAvatarOptions): AvatarColors {
  const random = seededRandom(options.playerId);

  // Pozicija įtakoja spalvas
  const positionIndex = { PG: 0, SG: 1, SF: 2, PF: 3, C: 4 }[options.position] || 2;

  return {
    hair: HAIR_COLORS[Math.floor(random() * HAIR_COLORS.length)],
    eyes: EYE_COLORS[Math.floor(random() * EYE_COLORS.length)],
    skin: SKIN_TONES[Math.floor(random() * SKIN_TONES.length)],
    jersey: JERSEY_COLORS[positionIndex % JERSEY_COLORS.length],
    background: '#F8F9FA',
  };
}

function generateAnimeAvatarSVG(options: PlayerAvatarOptions): string {
  const colors = getAvatarColors(options);
  const random = seededRandom(options.playerId);

  // Veido forma (pagal poziciją)
  const faceShapes = {
    PG: 'M30,15 Q50,5 70,15 Q75,25 72,40 Q70,55 50,58 Q30,55 28,40 Q25,25 30,15', // Ovalus
    SG: 'M30,18 Q50,8 70,18 L68,50 Q50,55 32,50 Z', // Šiek tiek smailiau
    SF: 'M28,20 Q50,10 72,20 Q75,35 70,50 Q50,56 30,50 Q25,35 28,20', // Vidutinis
    PF: 'M32,15 Q50,8 68,15 Q72,30 68,45 Q50,52 32,45 Q28,30 32,15', // Stambesnis
    C: 'M30,12 Q50,5 70,12 Q75,28 72,48 Q50,55 28,48 Q25,28 30,12', // Didelis
  };

  const facePath = faceShapes[options.position as keyof typeof faceShapes] || faceShapes.SF;

  // Plaukų stilius
  const hairStyles = [
    // Short spiky
    `
      <path d="M28,25 Q35,10 50,8 Q65,10 72,25 Q68,20 50,18 Q32,20 28,25" fill="${colors.hair}"/>
      <path d="M35,15 L40,8 L45,15 M50,12 L50,5 L55,12 M60,15 L65,8 L70,15" stroke="${colors.hair}" stroke-width="3" fill="none"/>
    `,
    // Medium flowing
    `
      <path d="M25,30 Q30,10 50,5 Q70,10 75,30 Q70,25 50,22 Q30,25 25,30" fill="${colors.hair}"/>
      <path d="M25,30 Q20,45 22,60 Q28,50 30,35" fill="${colors.hair}"/>
      <path d="M75,30 Q80,45 78,60 Q72,50 70,35" fill="${colors.hair}"/>
    `,
    // Long
    `
      <path d="M22,35 Q25,5 50,3 Q75,5 78,35 Q70,20 50,18 Q30,20 22,35" fill="${colors.hair}"/>
      <path d="M22,35 Q15,55 18,75 L25,65 Q22,50 25,40" fill="${colors.hair}"/>
      <path d="M78,35 Q85,55 82,75 L75,65 Q78,50 75,40" fill="${colors.hair}"/>
    `,
    // Ponytail
    `
      <path d="M28,28 Q35,8 50,5 Q65,8 72,28" fill="${colors.hair}"/>
      <path d="M72,28 Q85,35 80,55 Q75,45 72,35" fill="${colors.hair}"/>
      <circle cx="72" cy="28" r="4" fill="${colors.hair}"/>
    `,
    // Buzz cut
    `
      <ellipse cx="50" cy="22" rx="25" ry="12" fill="${colors.hair}"/>
    `,
    // Afro
    `
      <circle cx="50" cy="28" r="30" fill="${colors.hair}"/>
    `,
  ];

  const hairStyle = hairStyles[Math.floor(random() * hairStyles.length)];

  // Akių stiliai (anime style)
  const eyeStyles = [
    // Big anime eyes (PG, SG style)
    `
      <ellipse cx="40" cy="38" rx="6" ry="8" fill="white"/>
      <ellipse cx="60" cy="38" rx="6" ry="8" fill="white"/>
      <circle cx="40" cy="39" r="4" fill="${colors.eyes}"/>
      <circle cx="60" cy="39" r="4" fill="${colors.eyes}"/>
      <circle cx="41" cy="37" r="1.5" fill="white"/>
      <circle cx="61" cy="37" r="1.5" fill="white"/>
    `,
    // Focused eyes
    `
      <ellipse cx="40" cy="38" rx="5" ry="6" fill="white"/>
      <ellipse cx="60" cy="38" rx="5" ry="6" fill="white"/>
      <circle cx="40" cy="38" r="3" fill="${colors.eyes}"/>
      <circle cx="60" cy="38" r="3" fill="${colors.eyes}"/>
      <path d="M35,34 L45,34 M55,34 L65,34" stroke="#333" stroke-width="1.5" fill="none"/>
    `,
    // Determined eyes
    `
      <path d="M34,38 Q40,34 46,38" stroke="${colors.eyes}" stroke-width="2" fill="none"/>
      <path d="M54,38 Q60,34 66,38" stroke="${colors.eyes}" stroke-width="2" fill="none"/>
      <circle cx="40" cy="38" r="2" fill="${colors.eyes}"/>
      <circle cx="60" cy="38" r="2" fill="${colors.eyes}"/>
    `,
  ];

  const eyeStyle = eyeStyles[Math.floor(random() * eyeStyles.length)];

  // Burnos (pagal OVR)
  const eyebrows = options.ovr > 75
    ? `<path d="M33,32 Q40,28 47,32" stroke="${colors.hair}" stroke-width="2" fill="none"/>
       <path d="M53,32 Q60,28 67,32" stroke="${colors.hair}" stroke-width="2" fill="none"/>`
    : options.ovr > 60
    ? `<path d="M35,33 L47,33 M53,33 L65,33" stroke="${colors.hair}" stroke-width="1.5" fill="none"/>`
    : '';

  // Burnos (nebulumui)
  const blush = random() > 0.5
    ? `<ellipse cx="35" cy="44" rx="5" ry="2" fill="#FFB6C1" opacity="0.4"/>
       <ellipse cx="65" cy="44" rx="5" ry="2" fill="#FFB6C1" opacity="0.4"/>`
    : '';

  // Burna (šypsenos)
  const mouthExpressions = [
    `<path d="M42,50 Q50,54 58,50" stroke="#C0392B" stroke-width="2" fill="none"/>`, // Smile
    `<path d="M44,52 L56,52" stroke="#C0392B" stroke-width="2" fill="none"/>`, // Neutral
    `<path d="M45,52 Q50,50 55,52" stroke="#C0392B" stroke-width="2" fill="none"/>`, // Determined
  ];

  const mouth = mouthExpressions[Math.floor(random() * mouthExpressions.length)];

  // Marškinėliai su numeriu (paimti pirmąs raides iš playerId)
  const jerseyNumber = options.playerId.slice(0, 2).toUpperCase();

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="200" height="200">
  <!-- Background circle -->
  <circle cx="50" cy="50" r="48" fill="${colors.background}"/>

  <!-- Jersey/Shoulders -->
  <path d="M15,100 Q50,75 85,100 L85,100 L15,100 Z" fill="${colors.jersey}"/>
  <ellipse cx="50" cy="85" rx="20" ry="8" fill="${colors.jersey}" opacity="0.5"/>

  <!-- Jersey number -->
  <text x="50" y="90" text-anchor="middle" fill="white" font-family="Arial Black, sans-serif" font-size="14" font-weight="bold">${jerseyNumber}</text>

  <!-- Neck -->
  <ellipse cx="50" cy="65" rx="12" ry="8" fill="${colors.skin}"/>

  <!-- Face -->
  <path d="${facePath}" fill="${colors.skin}"/>

  ${hairStyle}

  <!-- Eyes -->
  ${eyeStyle}

  <!-- Eyebrows -->
  ${eyebrows}

  ${blush}

  <!-- Nose (anime style - simple) -->
  <path d="M50,42 L48,46 L52,46" fill="none" stroke="#B8956E" stroke-width="1" opacity="0.5"/>

  <!-- Mouth -->
  ${mouth}

  <!-- Position badge (small corner) -->
  <circle cx="85" cy="15" r="8" fill="${colors.jersey}"/>
  <text x="85" y="18" text-anchor="middle" fill="white" font-family="Arial" font-size="7" font-weight="bold">${options.position}</text>

  <!-- OVR badge (bottom) -->
  <rect x="38" y="95" width="24" height="5" rx="2" fill="#333"/>
  <text x="50" y="99" text-anchor="middle" fill="white" font-family="Arial" font-size="4">${options.ovr}</text>
</svg>
  `.trim();
}

// API Route function (naudoti Next.js API)
export function generatePlayerAvatarSVG(playerId: string, position: string, ovr: number): string {
  return generateAnimeAvatarSVG({ playerId, position, ovr });
}

// Convert SVG to Data URI (naudoti img src)
export function avatarToDataURI(svg: string): string {
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

// Generate avatar URL
export function getPlayerAvatarUrl(playerId: string, position: string, ovr: number): string {
  const svg = generatePlayerAvatarSVG(playerId, position, ovr);
  return avatarToDataURI(svg);
}

export { generateAnimeAvatarSVG, getAvatarColors };
