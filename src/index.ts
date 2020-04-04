import * as PIXI from 'pixi.js';
import { Card } from './classes/card.class';
import {
    getRandomInt,
    getDeck,
    rectsIntersect,
    cardHeapIntersect,
    shuffleDecks,
    getTestDeck
} from './utils';
import { CARDS_IMG, POS, CARD_PLACE_IMG, SUITS, OPEN_PADDNIG } from './constants';
import { Heap } from './classes/heap.class';
import { Deck } from './classes/deck.class';
import { HeapBySuit } from './classes/heap-by-suit.class';

const app = new PIXI.Application({
    width: 2000,
    height: 1000,
    backgroundColor: 0x999999
});

document.body.appendChild(app.view);

const baseTexture = PIXI.BaseTexture.from(CARDS_IMG);
const cardPlaceTexture = PIXI.Texture.from(CARD_PLACE_IMG);

const tableContainer = new PIXI.Container();

app.stage.addChild(tableContainer);

/* Setup Open Deck */
const openDeck = new Heap(cardPlaceTexture, true);
openDeck.position.set(POS.openDeck.x, POS.openDeck.y);

tableContainer.addChild(openDeck.container);

/* Setup heaps by suit */
const heapsBySuit = SUITS.map(suit => {
    const heap = new HeapBySuit(cardPlaceTexture);

    heap.position.set(
        POS.heapBySuit.find(it => it.suit === suit).x,
        POS.heapBySuit.find(it => it.suit === suit).y
    );

    tableContainer.addChild(heap.container);

    return heap;
});

/* Setup heaps */
const heaps = POS.heaps.map(it => {
    const heap = new Heap(cardPlaceTexture);

    heap.position.set(it.x, it.y);

    tableContainer.addChild(heap.container);

    return heap;
});

const allHeaps: Heap[] = [...heapsBySuit, ...heaps];

const openCont = new PIXI.Container();
tableContainer.addChild(openCont);

/* Setup Cards */
// const cards = shuffleDecks(getDeck(baseTexture));
const cards = getTestDeck(getDeck(baseTexture));

cards.forEach((card: Card, i: number) => {
    card.setTexture();
    card.position.set(POS.deck.x, POS.deck.y);
    makeDragable(card);
});

/* Setup Deck */
const deck = new Deck(cardPlaceTexture, cards, openDeck);
deck.position.set(POS.deck.x, POS.deck.y);
tableContainer.addChild(deck);

initGame(cards, heaps);

/* --- */

function setRandomPosition(card: Card): void {
    card.x = getRandomInt(0, 500);
    card.y = getRandomInt(0, 360);
}

function makeDragable(card: Card) {
    card.anchor.set(0.5);
    card.interactive = true;
    card.on('mousedown', onDragStart)
        .on('touchstart', onDragStart)
        .on('mouseup', onDragEnd)
        .on('mouseupoutside', onDragEnd)
        .on('touchend', onDragEnd)
        .on('touchendoutside', onDragEnd)
        .on('mousemove', onDragMove)
        .on('touchmove', onDragMove);
}

function onDragStart(event: any) {
    const card = event.target as Card;

    card.saveLastPlace();

    if (!card.isOpen) {
        if (card.isTopCard) {
            card.open();

            return;
        }

        return;
    }

    const container = card.parent as Heap;

    if (container.children[container.children.length - 1] !== card) {
        this.siblings = container.children.slice(container.children.indexOf(card) + 1);
    }

    tableContainer.addChild(event.target);    

    if (this.siblings) {
        this.siblings.forEach((it: Card) => {
            it.saveLastPlace();
            tableContainer.addChild(it);
        });
    }

    this.data = event.data;
    this.dragging = true;
    this.dragPoint = event.data.getLocalPosition(this.parent);
    this.dragPoint.x -= this.x;
    this.dragPoint.y -= this.y;

}

function onDragEnd(event: any) {
    if (!event.target || !(event.target as Card).isOpen) return;

    const heap = allHeaps.find(it =>
        cardHeapIntersect(event.target as Card, it)
    );

    if (heap) {
        heap.tryDropCard(event.target);
    }

    this.alpha = 1;
    this.dragging = false;
    this.data = null;
}

function onDragMove() {
    if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x - this.dragPoint.x;
        this.y = newPosition.y - this.dragPoint.y;

        if (this.siblings) {
            this.siblings.forEach((it: Card, i: number) => {
                const newPosition = this.data.getLocalPosition(this.parent);
                it.x = newPosition.x - this.dragPoint.x;
                it.y = newPosition.y - this.dragPoint.y + OPEN_PADDNIG * (i + 1);
            });
        }
    }
}

function initGame(cards: Card[], heaps: Heap[]) {
    heaps.reverse();
    const count = 1;

    // for debug
    // for (let i = 0; i < heaps.length; i++) {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < i + 1; j++) {
            const card = cards.pop();

            if (i === heaps.length - 1) {
                card.open();
            }

            heaps[j].addCard(card);
        }
    }

    heaps.reverse();
}
