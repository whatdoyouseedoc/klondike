import * as PIXI from 'pixi.js';
import { CARD_WIDTH, CARD_HEIGHT, COVER_IMG } from '../constants';
import { Suit, Rank, Color } from '../types';

interface CardConfig {
    suit: Suit;
    rank: Rank;
    face: PIXI.Texture;
}

export class Card extends PIXI.Sprite {
    suit: Suit;
    rank: Rank;
    isOpen = false;
    face: PIXI.Texture;
    cover: PIXI.Texture;
    sprite: PIXI.Sprite;

    lastPosition: {x: number, y: number};
    lastContainer: PIXI.Container;

    siblings: any;

    constructor(
        { suit, rank, face }: CardConfig,
        texture?: PIXI.Texture
    ) {
        super(texture);

        this.suit = suit;
        this.rank = rank;
        this.face = face;

        this.cover = new PIXI.Texture(
            new PIXI.BaseTexture(COVER_IMG),
            new PIXI.Rectangle(0, 0, CARD_WIDTH, CARD_HEIGHT)
        );

        this.close();
        this.anchor.set(0.5);
        this.interactive = true;
    }

    open(): void {
        this.isOpen = true;
        this.setTexture();
    }

    close(): void {
        this.isOpen = false;
        this.setTexture();
    }

    saveLastPosition(): void {
        this.lastPosition = {
            x: this.position.x,
            y: this.position.y,
        };
    }

    saveLastContainer(): void {
        this.lastContainer = this.parent;
    }

    saveLastPlace(): void {
        this.saveLastPosition();
        this.saveLastContainer();
    }

    moveToLastPlace(): void {
        this.position.set(this.lastPosition.x, this.lastPosition.y);
        this.lastContainer.addChild(this);

        if (this.siblings) {
            this.siblings.forEach((it: Card) => {
                it.moveToLastPlace();
            });

            this.siblings = null;
        }
    }

    get isTopCard(): boolean {
        return this.parent && this.parent.children[this.parent.children.length - 1] === this;
    }

    get color(): Color {
        return this.suit === 'hearts' || this.suit === 'tiles'
            ? 'red'
            : 'black';
    }

    setTexture(): void {
        this.texture = this.isOpen ? this.face : this.cover;
    }
}
