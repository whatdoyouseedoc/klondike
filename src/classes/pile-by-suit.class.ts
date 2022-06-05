import * as PIXI from 'pixi.js';
import { Pile } from './pile.class';
import { Suit } from '../types';
import { RANKS } from '../constants';
import { Card } from './card.class';
import { pileIsEmpty } from '../utils';

export class PileBySuit extends Pile {
    suit: Suit;

    constructor(texture?: PIXI.Texture) {
        super(texture, true);
        this.suit = null;
    }

    canDropCard(card: Card): boolean {
        if (pileIsEmpty(this)) {
            return card.rank === 'A';
        }

        return (
            card.suit === this.suit &&
            RANKS[RANKS.indexOf(card.rank) - 1] === this.topCard.rank
        );
    }

    addCard(card: Card): void {
        super.addCard(card);

        if (!this.suit) {
            this.suit = card.suit;
        }
    }
}
