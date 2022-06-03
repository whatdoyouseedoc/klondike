import * as PIXI from 'pixi.js';
import { Heap } from './heap.class';
import { Suit } from '../types';
import { RANKS } from '../constants';
import { Card } from './card.class';

export class HeapBySuit extends Heap {
    suit: Suit;

    constructor(texture?: PIXI.Texture) {
        super(texture, true);

        this.suit = null;
    }

    canDropCard(card: Card): boolean {
        if (this.container.children.length === 1) {
            return card.rank === 'A';
        }

        console.log('RANKS[RANKS.indexOf(card.rank) - 1]: ', RANKS[RANKS.indexOf(card.rank) - 1]);
        console.log('card.rank: ', card.rank);
        console.log('this.topCard.rank: ', this.topCard.rank);

        return card.suit === this.suit
            && RANKS[RANKS.indexOf(card.rank) - 1] === this.topCard.rank;
    }

    addCard(card: Card): void {
        super.addCard(card);

        if (!this.suit) {
            this.suit = card.suit;
        }
    }
}
