import * as PIXI from 'pixi.js';
import { Suit, Rank, Color } from '../types';
interface CardConfig {
    suit: Suit;
    rank: Rank;
    face: PIXI.Texture;
}
export declare class Card extends PIXI.Sprite {
    suit: Suit;
    rank: Rank;
    isOpen: boolean;
    face: PIXI.Texture;
    cover: PIXI.Texture;
    sprite: PIXI.Sprite;
    lastPosition: {
        x: number;
        y: number;
    };
    lastContainer: PIXI.Container;
    siblings: any;
    constructor({ suit, rank, face }: CardConfig, texture?: PIXI.Texture);
    open(): void;
    close(): void;
    saveLastPosition(): void;
    saveLastContainer(): void;
    saveLastPlace(): void;
    moveToLastPlace(): void;
    readonly isTopCard: boolean;
    readonly color: Color;
    setTexture(): void;
}
export {};
