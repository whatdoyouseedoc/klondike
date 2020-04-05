import * as PIXI from 'pixi.js';
import { Heap } from './heap.class';
import { Suit } from '../types';
import { Card } from './card.class';
export declare class HeapBySuit extends Heap {
    suit: Suit;
    constructor(texture?: PIXI.Texture);
    canDropCard(card: Card): boolean;
    addCard(card: Card): void;
}
