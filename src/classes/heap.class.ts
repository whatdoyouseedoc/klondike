import * as PIXI from 'pixi.js';
import { Card } from './card.class';
import { OPEN_PADDNIG, CLOSE_PADDNIG, RANKS } from '../constants';

export class Heap extends PIXI.Sprite {
    container: PIXI.Container;
    noPadding: boolean;

    constructor(texture?: PIXI.Texture, noPadding = false) {
        super(texture);
        this.anchor.set(0.5);

        this.noPadding = noPadding;

        this.container = new PIXI.Container();
        this.container.addChild(this);
    }

    get cardIndexInHeap(): number {
        return this.container.children.length - 2;
    }

    get topCard(): Card {
        return this.container.children[this.container.children.length - 1] as Card;
    }

    get secondCard(): Card {
        return this.container.children[this.container.children.length - 2] as Card;
    }

    getY(isOpen: boolean): number {
        const y = this.secondCard.position.y;

        if (this.noPadding) {
            return y;
        }

        return isOpen
            ? this.secondCard.isOpen
                ? y + OPEN_PADDNIG
                : y + CLOSE_PADDNIG
            : y + CLOSE_PADDNIG;
    }

    tryDropCard(card: Card): void {
        if (!this.canDropCard(card)) {
             card.moveToLastPlace();

            if (card.siblings) {
                debugger;
                
                card.siblings.forEach((it: Card) => {
                    it.moveToLastPlace();
                });
    
                card.siblings = null;
            }
        } else {
            this.addCard(card);

            if (card.siblings) {
                card.siblings.forEach((it: Card) => {
                    this.addCard(it);
                });
    
                card.siblings = null;
            }
        }
    }

    canDropCard(card: Card): boolean {
        if (this.container.children.length === 1) {
            return card.rank === 'K';
        }
        
        return this.topCard.isOpen
            && card.color !== this.topCard.color
            && RANKS[RANKS.indexOf(card.rank) + 1] === this.topCard.rank;
    }



    addCard(card: Card) {
        this.container.addChild(card);

        if (this.container.children.length <= 2) {
            card.position.set(this.position.x, this.position.y);
        } else {
            card.position.set(this.position.x, this.getY(card.isOpen));
        }
    }
}
