export interface EventTrack {
  id: string;
  title: string;
  ribbon: string;
  category: string;
  description: string;
  teamSizeLabel: string;
  maxMembers: number;
  iconName: string;
}

export const EVENT_TRACKS: EventTrack[] = [
  {
    id: 'code-crusade',
    title: 'Code Crusade',
    ribbon: 'Coding',
    category: 'Coding Challenge',
    description: 'Solve complex algorithmic problems and beat the clock. Demonstrate your programming skills.',
    teamSizeLabel: '1 Member (Individual)',
    maxMembers: 1,
    iconName: 'Code',
  },
  {
    id: 'logic-arena',
    title: 'Logic Arena',
    ribbon: 'Quiz',
    category: 'Quiz Competition',
    description: 'Test your logical reasoning and technical knowledge in an exciting multi-round quiz battle.',
    teamSizeLabel: '1 Member (Individual)',
    maxMembers: 1,
    iconName: 'HelpCircle',
  },
  {
    id: 'ui-ux-studio',
    title: 'UI/UX Studio',
    ribbon: 'Design',
    category: 'Design Challenge',
    description: 'Design stunning user interfaces with exceptional user experience under pressure.',
    teamSizeLabel: '1 Member (Individual)',
    maxMembers: 1,
    iconName: 'Layout',
  },
  {
    id: 'tech-tactics',
    title: 'Tech Tactics',
    ribbon: 'Paper',
    category: 'Paper Presentation',
    description: 'Present your innovative research and technical insights to showcase your ideas and expertise.',
    teamSizeLabel: '1 - 4 Members',
    maxMembers: 4,
    iconName: 'FileText',
  },
  {
    id: 'pixel-pulse',
    title: 'Pixel Pulse',
    ribbon: 'Poster',
    category: 'Poster Design',
    description: 'Create visually stunning and creative posters that convey complex technical messages effectively.',
    teamSizeLabel: '1 Member (Individual)',
    maxMembers: 1,
    iconName: 'Image',
  },
];
