import * as PIXI from 'pixi.js';
import { Card } from './classes/card.class';
import { Heap } from './classes/heap.class';
export declare function getRandomInt(min: number, max: number): number;
export declare function getFace(baseTexture: PIXI.BaseTexture, line: number, row: number): PIXI.Texture;
export declare function getDeck(baseTexture: PIXI.BaseTexture): Card[];
export declare function getTestDeck(deck: Card[]): Card[];
export declare function shuffleDecks(cards: Card[]): Card[];
export declare function cardHeapIntersect(card: Card, heap: Heap): boolean;
