import * as PIXI from 'pixi.js';
import { CARD_WIDTH, CARD_HEIGHT, COVER_IMG, RANKS } from '../constants';
import { Suit, Rank, Color } from '../types';
import { cardHeapIntersect } from '../utils';

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

    constructor({ suit, rank, face }: CardConfig, texture?: PIXI.Texture) {
        super(texture);

        this.suit = suit;
        this.rank = rank;
        this.face = face;

        this.cover = new PIXI.Texture(
            new PIXI.BaseTexture(COVER_IMG),
            new PIXI.Rectangle(0, 0, CARD_WIDTH, CARD_HEIGHT)
        );

        this.close();
    }

    open() {
        this.isOpen = true;
        this.setTexture();
    }

    close() {
        this.isOpen = false;
        this.setTexture();
    }

    saveLastPosition() {
        this.lastPosition = {
            x: this.position.x,
            y: this.position.y,
        };
    }

    saveLastContainer() {
        this.lastContainer = this.parent;
    }

    saveLastPlace() {
        this.saveLastPosition();
        this.saveLastContainer();
    }

    moveToLastPlace() {
        this.position.set(this.lastPosition.x, this.lastPosition.y);
        this.lastContainer.addChild(this);

        if (this.siblings) {
            this.siblings.forEach((it: Card) => {
                it.moveToLastPlace();
            });

            this.siblings = null;
        }
    }

    // get nextRank(): Rank {
    //     return this.rank === 'K' ? null : RANKS[RANKS.indexOf(this.rank) + 1] as Rank;
    // }

    get isTopCard(): boolean {
        return this.parent && this.parent.children[this.parent.children.length - 1] === this;
    }

    get color(): Color {
        return this.suit === 'hearts' || this.suit === 'tiles'
            ? 'red'
            : 'black';
    }

    setTexture() {
        this.texture = this.isOpen ? this.face : this.cover;
    }
}
