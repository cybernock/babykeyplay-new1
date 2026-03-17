export const THEMES = {
  SPACE: {
    id: 'space',
    name: 'Space',
    backgroundColor: '#0a0e27',
    primaryColor: '#ffffff',
    particleColors: ['#ff006e', '#00f5ff', '#39ff14', '#b537f2', '#ff6b35', '#ffff00'],
    particleShapes: ['circle', 'star'],
    backgroundAnimations: 'stars',
    description: 'Dark cosmic background with neon stars and planets.'
  },
  OCEAN: {
    id: 'ocean',
    name: 'Ocean',
    backgroundColor: '#001e36',
    primaryColor: '#00a8ff',
    particleColors: ['#00a8ff', '#0097e6', '#4bcffa', '#48dbfb', '#ffffff'],
    particleShapes: ['circle', 'bubble'],
    backgroundAnimations: 'bubbles',
    description: 'Deep blue sea with floating bubbles and water ripples.'
  },
  JUNGLE: {
    id: 'jungle',
    name: 'Jungle',
    backgroundColor: '#0b2b0b',
    primaryColor: '#4cd137',
    particleColors: ['#4cd137', '#44bd32', '#e1b12c', '#fbc531', '#8c7ae6'],
    particleShapes: ['circle', 'leaf'],
    backgroundAnimations: 'vines',
    description: 'Lush green environment with falling leaves.'
  },
  CANDY: {
    id: 'candy',
    name: 'Candy',
    backgroundColor: '#ffcccc',
    primaryColor: '#ff4d4d',
    particleColors: ['#ff4d4d', '#ff3838', '#ffb8b8', '#ff9ff3', '#feca57'],
    particleShapes: ['circle', 'square', 'candy'],
    backgroundAnimations: 'sprinkles',
    description: 'Sweet pastel colors with candy shapes.'
  },
  NEON: {
    id: 'neon',
    name: 'Neon Cyber',
    backgroundColor: '#000000',
    primaryColor: '#00ff00',
    particleColors: ['#ff00ff', '#00ffff', '#00ff00', '#ffff00', '#ff0000'],
    particleShapes: ['square', 'line'],
    backgroundAnimations: 'grid',
    description: 'High contrast dark mode with bright neon geometric shapes.'
  }
};

export function getThemeConfig(themeId) {
  return THEMES[themeId.toUpperCase()] || THEMES.SPACE;
}
