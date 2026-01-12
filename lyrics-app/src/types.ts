export interface Song {
  id: string;
  title: string;
  artist?: string;
  genre?: string;
  createdAt: Date;
  updatedAt: Date;
  sections: SongSection[];
}

export interface SongSection {
  id: string;
  type: SectionType;
  title?: string;
  lyrics: string;
  order: number;
}

export type SectionType = 'verse' | 'chorus' | 'bridge' | 'intro' | 'outro' | 'pre-chorus' | 'hook';

export interface SongTemplate {
  id: string;
  name: string;
  description: string;
  structure: SectionType[];
}

export interface OpenAIPrompt {
  theme?: string;
  style?: string;
  mood?: string;
  sectionType?: SectionType;
  existingLyrics?: string;
}

export const SONG_TEMPLATES: SongTemplate[] = [
  {
    id: 'pop-standard',
    name: 'Pop Standard',
    description: 'Verse-Chorus-Verse-Chorus-Bridge-Chorus',
    structure: ['verse', 'chorus', 'verse', 'chorus', 'bridge', 'chorus']
  },
  {
    id: 'rock-anthem',
    name: 'Rock Anthem',
    description: 'Intro-Verse-Chorus-Verse-Chorus-Solo-Chorus-Outro',
    structure: ['intro', 'verse', 'chorus', 'verse', 'chorus', 'bridge', 'chorus', 'outro']
  },
  {
    id: 'rap-song',
    name: 'Rap Song',
    description: 'Intro-Verse-Hook-Verse-Hook-Bridge-Hook-Outro',
    structure: ['intro', 'verse', 'hook', 'verse', 'hook', 'bridge', 'hook', 'outro']
  },
  {
    id: 'ballad',
    name: 'Ballad',
    description: 'Intro-Verse-Chorus-Verse-Chorus-Bridge-Chorus-Outro',
    structure: ['intro', 'verse', 'chorus', 'verse', 'chorus', 'bridge', 'chorus', 'outro']
  },
  {
    id: 'blank',
    name: 'Blank Canvas',
    description: 'Start with a completely empty song',
    structure: []
  }
];







