import * as PIXI from 'pixi.js';
import { Card } from './card.class';
import { Heap } from './heap.class';
export declare class Deck extends PIXI.Sprite {
    coverTexture: PIXI.Texture;
    emptyTexture: PIXI.Texture;
    cards: Card[];
    openDeck: Heap;
    constructor(emptyTexture: PIXI.Texture, cards: Card[], openDeck: Heap);
    setSprite(isEmpty: boolean): void;
    dropCard(): void;
}
