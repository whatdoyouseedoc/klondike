import * as PIXI from 'pixi.js';
import { CARD_WIDTH, CARD_HEIGHT, SUITS, RANKS, CANVAS_PADDING, PADDING, OPEN_PADDNIG } from './constants';
import { Card } from './classes/card.class';
import { Suit, Rank } from './types';
import { Heap } from './classes/heap.class';

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

export function getDeck (baseTexture: PIXI.BaseTexture): Card[] {
    const deck: Card[] = [];

    SUITS.forEach((suit: Suit, line) => {
        RANKS.forEach((rank, row) => {
            deck.push(
                new Card({
                    suit: suit,
                    rank: rank as Rank,
                    face: getFace(baseTexture, line, row)
                })
            );
        });
    });

    return deck;
}

export function getTestDeck(deck: Card[]): Card[] {
    return [
        deck.find(it => it.rank === 'K' && it.suit === 'hearts'),
        deck.find(it => it.rank === 'Q' && it.suit === 'pikes'),
        deck.find(it => it.rank === 'J' && it.suit === 'hearts'),
        deck.find(it => it.rank === '10' && it.suit === 'pikes'),
        deck.find(it => it.rank === '9' && it.suit === 'hearts'),
        deck.find(it => it.rank === '8' && it.suit === 'pikes'),
        deck.find(it => it.rank === '7' && it.suit === 'hearts'),
        deck.find(it => it.rank === '6' && it.suit === 'pikes'),
        deck.find(it => it.rank === '5' && it.suit === 'hearts'),
        deck.find(it => it.rank === '4' && it.suit === 'pikes'),
        deck.find(it => it.rank === '3' && it.suit === 'hearts'),
        deck.find(it => it.rank === '2' && it.suit === 'pikes'),
        deck.find(it => it.rank === 'A' && it.suit === 'hearts')
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

export function cardHeapIntersect(card: Card, heap: Heap): boolean {
    const heapLastChild = () => heap.container.children[heap.container.children.length - 1];

    const heapBox = {
        x: heap.getBounds().x,
        width: heap.getBounds().width,
        y: heap.getBounds().y,
        height: heapLastChild().getBounds().y + heapLastChild().getBounds().height
    };

    return (
        card.x + card.width > heapBox.x &&
        card.x < heapBox.x + heapBox.width &&
        card.y + card.height > heapBox.y &&
        card.y < heapBox.y + heapBox.height
    );
}

export function calcCanvasWidth() {
    return CANVAS_PADDING * 2 + CARD_WIDTH * 7 + PADDING * 6;
}

export function calcCanvasHeight() {
    return CANVAS_PADDING * 2 + CARD_HEIGHT + PADDING + OPEN_PADDNIG * 13 + CARD_HEIGHT;
}
