export const MODES = {
  FREE_PLAY: {
    id: 'free_play',
    name: 'Free Play',
    description: 'Tap and type to create colorful explosions and sounds.',
    behavior: 'particles',
    soundType: 'synth',
    visualFeedback: 'explosion'
  },
  LEARNING: {
    id: 'learning',
    name: 'Learning',
    description: 'Press keys to see letters and numbers appear.',
    behavior: 'text',
    soundType: 'speak',
    visualFeedback: 'float_text'
  },
  ANIMAL: {
    id: 'animal',
    name: 'Animal Friends',
    description: 'Discover animals and their sounds.',
    behavior: 'emoji',
    soundType: 'animal',
    visualFeedback: 'pop_emoji'
  },
  MUSIC: {
    id: 'music',
    name: 'Music Maker',
    description: 'Play the keyboard like a piano.',
    behavior: 'notes',
    soundType: 'piano',
    visualFeedback: 'ripple'
  }
};

export function getModeConfig(modeId) {
  return MODES[modeId.toUpperCase()] || MODES.FREE_PLAY;
}
