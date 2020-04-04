import * as PIXI from 'pixi.js';
import {
    COVER_IMG,
    CARD_WIDTH,
    CARD_HEIGHT
} from '../constants';
import { Card } from './card.class';
import { Heap } from './heap.class';

export class Deck extends PIXI.Sprite {
    coverTexture: PIXI.Texture;
    emptyTexture: PIXI.Texture;
    cards: Card[];
    openDeck: Heap;

    constructor(emptyTexture: PIXI.Texture, cards: Card[], openDeck: Heap) {
        super(emptyTexture);

        this.emptyTexture = emptyTexture;
        this.cards = cards;
        this.openDeck = openDeck;

        this.coverTexture = new PIXI.Texture(
            new PIXI.BaseTexture(COVER_IMG),
            new PIXI.Rectangle(0, 0, CARD_WIDTH, CARD_HEIGHT)
        );

        this.anchor.set(0.5);
        this.texture = this.coverTexture;
        this.interactive = true;

        this.on('mousedown', this.dropCard);
    }

    setSprite(isEmpty: boolean) {
        this.texture = isEmpty ? this.emptyTexture : this.coverTexture;
    }

    dropCard() {
        if (!this.cards.length) {
            if (this.openDeck.container.children.length === 1) {
                /* The deck is empty */
                return;
            }

            while (this.openDeck.container.children.length > 1) {
                const card = this.openDeck.container.children.pop() as Card;
                card.close();
                this.cards.push(card);
            }

            this.texture = this.coverTexture;
        } else {
            const card = this.cards.pop();
            card.open();
            this.openDeck.addCard(card);

            if (!this.cards.length) {
                this.texture = this.emptyTexture;
            }
        }
    }
}
