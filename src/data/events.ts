export interface EventTrack {
  id: string;
  title: string;
  ribbon: string;
  category: string;
  description: string;
  teamSizeLabel: string;
  iconName: string;
}

export const EVENT_TRACKS: EventTrack[] = [
  {
    id: 'code-crusade',
    title: 'Code Crusade',
    ribbon: 'CODE',
    category: 'Coding Challenge',
    description: 'Solve complex algorithmic problems and beat the clock. Demonstrate your programming mastery under pressure.',
    teamSizeLabel: '1 Member',
    iconName: 'Code',
  },
  {
    id: 'logic-arena',
    title: 'Logic Arena',
    ribbon: 'QUIZ',
    category: 'Quiz Competition',
    description: 'Test logical reasoning, technical knowledge, and speed in a high-stakes multi-round quiz battle.',
    teamSizeLabel: '1 Member',
    iconName: 'HelpCircle',
  },
  {
    id: 'ui-ux-studio',
    title: 'UI/UX Studio',
    ribbon: 'DESIGN',
    category: 'Design Challenge',
    description: 'Design exceptional interfaces and user experiences under pressure. Craft what others only imagine.',
    teamSizeLabel: '1 Member',
    iconName: 'Layout',
  },
  {
    id: 'tech-tactics',
    title: 'Tech Tactics',
    ribbon: 'PAPER',
    category: 'Paper Presentation',
    description: 'Present innovative research and technical insights that challenge the room and showcase your ideas.',
    teamSizeLabel: '1–4 Members',
    iconName: 'FileText',
  },
  {
    id: 'pixel-pulse',
    title: 'Pixel Pulse',
    ribbon: 'POSTER',
    category: 'Poster Design',
    description: 'Turn complex technical ideas into compelling visual stories. Make them feel it before they read it.',
    teamSizeLabel: '1 Member',
    iconName: 'Image',
  },
];
