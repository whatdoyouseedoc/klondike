import * as PIXI from 'pixi.js';
import { Card } from './card.class';
export declare class Heap extends PIXI.Sprite {
    noPadding: boolean;
    container: PIXI.Container;
    constructor(texture?: PIXI.Texture, noPadding?: boolean);
    readonly topCard: Card;
    readonly secondCard: Card;
    calculatePositionY(isOpen: boolean): number;
    tryDropCard(card: Card): void;
    canDropCard(card: Card): boolean;
    addCard(card: Card): void;
}
