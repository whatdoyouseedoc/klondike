/* Images */
export const CARDS_IMG = './images/cards-80-120.png';
export const COVER_IMG = './images/cover-sun-80-120.png';
export const CARD_PLACE_IMG = './images/place-80-120.png';

export const SUITS = ['hearts', 'tiles', 'clovers', 'pikes'];
export const RANKS = [
  'A',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
];

/* Sizes */
export const CANVAS_WIDTH = 1000;
export const CANVAS_HEIGHT = 800;
export const CARD_WIDTH = 80;
export const CARD_HEIGHT = 120;
export const CANVAS_PADDING = 40;

export const PADDING = 20;

const startX = CANVAS_PADDING;
const rowStep = CARD_WIDTH;
// const paddingLeft = CARD_WIDTH / 2;
const paddingLeft = PADDING;

const startY = CANVAS_PADDING;
const lineStep = CARD_HEIGHT;
// const paddingTop = CARD_HEIGHT / 2;
const paddingTop = PADDING;

export const OPEN_PADDNIG = CARD_HEIGHT / 4;
export const CLOSE_PADDNIG = 8;

export const POS = {
  deck: {
    x: startX + (rowStep + paddingLeft) * 0,
    y: startY,
  },

  openDeck: {
    x: startX + (rowStep + paddingLeft) * 1,
    y: startY,
  },

  pileBySuit: [
    {
      suit: 'hearts',
      x: startX + (rowStep + paddingLeft) * 3,
      y: startY,
    },

    {
      suit: 'tiles',
      x: startX + (rowStep + paddingLeft) * 4,
      y: startY,
    },

    {
      suit: 'clovers',
      x: startX + (rowStep + paddingLeft) * 5,
      y: startY,
    },

    {
      suit: 'pikes',
      x: startX + (rowStep + paddingLeft) * 6,
      y: startY,
    },
  ],

  piles: [
    {
      x: startX + (rowStep + paddingLeft) * 0,
      y: startY + lineStep + paddingTop,
    },
    {
      x: startX + (rowStep + paddingLeft) * 1,
      y: startY + lineStep + paddingTop,
    },
    {
      x: startX + (rowStep + paddingLeft) * 2,
      y: startY + lineStep + paddingTop,
    },
    {
      x: startX + (rowStep + paddingLeft) * 3,
      y: startY + lineStep + paddingTop,
    },
    {
      x: startX + (rowStep + paddingLeft) * 4,
      y: startY + lineStep + paddingTop,
    },
    {
      x: startX + (rowStep + paddingLeft) * 5,
      y: startY + lineStep + paddingTop,
    },
    {
      x: startX + (rowStep + paddingLeft) * 6,
      y: startY + lineStep + paddingTop,
    },
  ],
};
