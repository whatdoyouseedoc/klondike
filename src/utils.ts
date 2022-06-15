import * as PIXI from 'pixi.js';
import { Card } from './classes/card.class';
import { Pile } from './classes/pile.class';
import {
  CANVAS_PADDING,
  CARD_HEIGHT,
  CARD_WIDTH,
  OPEN_PADDNIG,
  PADDING,
  RANKS,
  SUITS
} from './constants';
import { Rank, Suit } from './types';

export function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min)) + min;
}

export function getFace(
    baseTexture: PIXI.BaseTexture,
    line: number,
    row: number
): PIXI.Texture {
    const rect = new PIXI.Rectangle(
        CARD_WIDTH * row,
        CARD_HEIGHT * line,
        CARD_WIDTH,
        CARD_HEIGHT
    );

    return new PIXI.Texture(baseTexture, rect);
}

export function getDeck(baseTexture: PIXI.BaseTexture): Card[] {
    const deck: Card[] = [];

    SUITS.forEach((suit: Suit, line) => {
        RANKS.forEach((rank, row) => {
            deck.push(
                new Card({
                    suit: suit,
                    rank: rank as Rank,
                    face: getFace(baseTexture, line, row),
                })
            );
        });
    });

    return deck;
}

export function getTestDeck(deck: Card[]): Card[] {
    return [
        deck.find((it) => it.rank === 'A' && it.suit === 'hearts'),
        deck.find((it) => it.rank === 'K' && it.suit === 'hearts'),
        deck.find((it) => it.rank === 'Q' && it.suit === 'pikes'),
        deck.find((it) => it.rank === 'J' && it.suit === 'hearts'),
        deck.find((it) => it.rank === '10' && it.suit === 'pikes'),
        deck.find((it) => it.rank === '9' && it.suit === 'hearts'),
        deck.find((it) => it.rank === '8' && it.suit === 'pikes'),
        deck.find((it) => it.rank === '7' && it.suit === 'hearts'),
        deck.find((it) => it.rank === '6' && it.suit === 'pikes'),
        deck.find((it) => it.rank === '5' && it.suit === 'hearts'),
        deck.find((it) => it.rank === '4' && it.suit === 'pikes'),
        deck.find((it) => it.rank === '3' && it.suit === 'hearts'),
        deck.find((it) => it.rank === '2' && it.suit === 'pikes'),
    ];
}

export function shuffleDecks(cards: Card[]): Card[] {
    const result: Card[] = [];
    const copy: Card[] = [...cards];

    while (copy.length) {
        result.push(...copy.splice(getRandomInt(0, copy.length - 1), 1));
    }

    return result;
}

export function cardPileIntersect(card: Card, pile: Pile): boolean {
    const pileLastChild = () =>
        pile.container.children[pile.container.children.length - 1];

    const pileBox = {
        x: pile.getBounds().x,
        width: pile.getBounds().width,
        y: pile.getBounds().y,
        height:
            pileLastChild().getBounds().y + pileLastChild().getBounds().height,
    };

    return (
        card.x + card.width > pileBox.x &&
        card.x < pileBox.x + pileBox.width &&
        card.y + card.height > pileBox.y &&
        card.y < pileBox.y + pileBox.height
    );
}

export function calcCanvasWidth(): number {
    return CANVAS_PADDING * 2 + CARD_WIDTH * 7 + PADDING * 6;
}

export function calcCanvasHeight(): number {
    return (
        CANVAS_PADDING * 2 +
        CARD_HEIGHT +
        PADDING +
        OPEN_PADDNIG * 13 +
        CARD_HEIGHT
    );
}

export function didClickOnCard(card: Card, point: PIXI.Point): boolean {
    const { x, y, width, height } = card.getBounds();

    return (
        point.x >= x &&
        point.x <= x + width &&
        point.y >= y &&
        point.y <= y + height
    );
}

export function getTopCardInPile(pile: Pile): Card {
    if (pile.container.children.length <= 1) {
        return;
    }

    const topCard = pile.container.children[
        pile.container.children.length - 1
    ] as Card;

    if (!topCard.isOpen) {
        return;
    }

    return topCard;
}

/* Check if pile is empty. Pile is empty when it has no cards */
export function pileIsEmpty(pile: Pile): boolean {
    return pile.container.children.length <= 1;
}
