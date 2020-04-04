import * as PIXI from 'pixi.js';
import { Card } from './classes/card.class';
import {
    getDeck,
    cardHeapIntersect,
    shuffleDecks,
} from './utils';
import {
    CARDS_IMG,
    POS,
    CARD_PLACE_IMG,
    SUITS,
    OPEN_PADDNIG,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
} from './constants';
import { Heap } from './classes/heap.class';
import { Deck } from './classes/deck.class';
import { HeapBySuit } from './classes/heap-by-suit.class';

/* Setup canvas */
const app = new PIXI.Application({
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundColor: 0x999999,
});

document.body.appendChild(app.view);

const cardPlaceTexture = PIXI.Texture.from(CARD_PLACE_IMG);

/* Wrapper container for heaps containers
dragged cards places in this container for proper z-index ordering */
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
const heaps = POS.heaps.map(({ x, y }) => {
    const heap = new Heap(cardPlaceTexture);

    heap.position.set(x, y);
    tableContainer.addChild(heap.container);

    return heap;
});

const allHeaps: Heap[] = [...heapsBySuit, ...heaps];

const openCont = new PIXI.Container();
tableContainer.addChild(openCont);

/* Setup Cards */
const cardsBaseTexture = PIXI.BaseTexture.from(CARDS_IMG);
const cards = shuffleDecks(getDeck(cardsBaseTexture));
// const cards = getTestDeck(getDeck(cardsBaseTexture, tableContainer));

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

function makeDragable(card: Card) {
    card.on('mousedown', onDragStart)
        .on('touchstart', onDragStart)
        .on('mouseup', onDragEnd)
        .on('mouseupoutside', onDragEnd)
        .on('touchend', onDragEnd)
        .on('touchendoutside', onDragEnd)
        .on('mousemove', onDragMove)
        .on('touchmove', onDragMove);
}

function initGame(cards: Card[], heaps: Heap[]) {
    heaps.reverse();

    // for debug
    for (let i = 0; i < heaps.length; i++) {
        // for (let i = 0; i < 4; i++) {
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
        this.siblings = container.children.slice(
            container.children.indexOf(card) + 1
        );
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
    const card: Card = event.currentTarget as Card;

    if (!event.target || !(event.target as Card).isOpen) {
        card.moveToLastPlace();
    } else {
        const targetHeap = allHeaps.find(it => cardHeapIntersect(card, it));

        if (!targetHeap) {
            card.moveToLastPlace();

            if (card.siblings) {
                card.siblings.forEach((it: Card) => {
                    it.moveToLastPlace();
                });

                card.siblings = null;
            }
        } else {
            targetHeap.tryDropCard(event.target);
        }
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
                it.y =
                    newPosition.y - this.dragPoint.y + OPEN_PADDNIG * (i + 1);
            });
        }
    }
}
