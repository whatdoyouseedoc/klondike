import * as PIXI from 'pixi.js';
import { Card } from './classes/card.class';
import { Deck } from './classes/deck.class';
import { PileBySuit } from './classes/pile-by-suit.class';
import { Pile } from './classes/pile.class';
import {
    CARDS_IMG,
    CARD_PLACE_IMG,
    OPEN_PADDNIG,
    POS,
    RANKS,
    SUITS
} from './constants';
import {
    calcCanvasHeight,
    calcCanvasWidth,
    cardPileIntersect,
    didClickedOnCard,
    getDeck,
    getTopCardInPile,
    pileIsEmpty,
    shuffleDecks
} from './utils';

/* Setup canvas */
const app = new PIXI.Application({
    width: calcCanvasWidth(),
    height: calcCanvasHeight(),
    backgroundColor: 0x999999,
});

const a = {
    a: 42,
};

document.body.appendChild(app.view);

const cardPlaceTexture = PIXI.Texture.from(CARD_PLACE_IMG);

/* Wrapper container for piles containers
dragged cards places in this container for proper z-index ordering */
const tableContainer = new PIXI.Container();
app.stage.addChild(tableContainer);

/* Setup Open Deck */
const openDeck = new Pile(cardPlaceTexture, true);
openDeck.position.set(POS.openDeck.x, POS.openDeck.y);
tableContainer.addChild(openDeck.container);

// TODO: useless??
// const openCont = new PIXI.Container();
// tableContainer.addChild(openCont);

/* Setup piles by suit */
const pilesBySuit = getPilesBySuit();

/* Setup piles */
const piles = getPiles();

const getAllPiles = () => [...pilesBySuit, ...piles];

/* Setup Cards */
const cardsBaseTexture = PIXI.BaseTexture.from(CARDS_IMG);
const cards = shuffleDecks(getDeck(cardsBaseTexture));
// const cards = getTestDeck(getDeck(cardsBaseTexture));

/* Prepare cards */
cards.forEach((card: Card, i: number) => {
    card.setTexture();
    card.position.set(POS.deck.x, POS.deck.y);
    makeDragable(card);
});

/* Setup Deck */
const deck = new Deck(cardPlaceTexture, cards, openDeck);
deck.position.set(POS.deck.x, POS.deck.y);
tableContainer.addChild(deck);

initGame(cards, piles);

/* Make cards interactive */
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

function initGame(cards: Card[], piles: Pile[]) {
    piles.reverse();

    // for debug
    for (let i = 0; i < piles.length; i++) {
        // for test piles
        // for (let i = 0; i < 4; i++) {
        for (let j = 0; j < i + 1; j++) {
            const card = cards.pop();

            if (i === piles.length - 1) {
                card.open();
            }

            piles[j].addCard(card);
        }
    }

    piles.reverse();

    setupDoubleClickHandler();
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

    const container = card.parent as Pile;

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

    if (!card.isOpen) {
        return;
    }

    if (!event.target || !(event.target as Card).isOpen) {
        card.moveToLastPlace();
    } else {
        const targetPile = getAllPiles().find((it) =>
            cardPileIntersect(card, it)
        );

        if (!targetPile) {
            card.moveToLastPlace();

            if (card.siblings) {
                card.siblings.forEach((it: Card) => {
                    it.moveToLastPlace();
                });

                card.siblings = null;
            }
        } else {
            targetPile.tryDropCard(event.target);
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

/* Setup PilesBySuit */
function getPilesBySuit() {
    return SUITS.map((suit) => {
        const pile = new PileBySuit(cardPlaceTexture);

        pile.position.set(
            POS.pileBySuit.find((it) => it.suit === suit).x,
            POS.pileBySuit.find((it) => it.suit === suit).y
        );

        tableContainer.addChild(pile.container);

        return pile;
    });
}

/* Setup Piles */
function getPiles() {
    return POS.piles.map(({ x, y }) => {
        const pile = new Pile(cardPlaceTexture);

        pile.position.set(x, y);
        tableContainer.addChild(pile.container);

        return pile;
    });
}

/* Setup double click feature */
function setupDoubleClickHandler(): void {
    const interactionManager = app.renderer.plugins.interaction;

    app.view.addEventListener('dblclick', (event) => {
        const point = new PIXI.Point();
        interactionManager.mapPositionToPoint(
            point,
            event.clientX,
            event.clientY
        );

        [...piles, openDeck].forEach((pile) => {
            const topCard = getTopCardInPile(pile);

            if (!topCard) {
                return;
            }

            if (didClickedOnCard(topCard, point)) {
                if (topCard.rank === 'A') {
                    moveAceToEmptyPileBySuit(topCard, pilesBySuit);
                } else {
                    const applicablePile = getApplicablePile(
                        topCard,
                        pilesBySuit
                    );

                    if (applicablePile) {
                        applicablePile.tryDropCard(topCard);
                    }
                }
            }
        });
    });
}

function moveAceToEmptyPileBySuit(card: Card, pilesBySuit: PileBySuit[]): void {
    const emptyPile = pilesBySuit.find((pile) => {
        if (pileIsEmpty(pile)) {
            return pile;
        }
    });

    emptyPile.tryDropCard(card);
}

function getApplicablePile(card: Card, pilesBySuit: PileBySuit[]): Pile {
    return pilesBySuit.find((pile) => {
        if (pileIsEmpty(pile)) {
            return;
        }

        const topCard = pile.container.children[
            pile.container.children.length - 1
        ] as Card;

        if (
            topCard.suit === card.suit &&
            RANKS.indexOf(topCard.rank) === RANKS.indexOf(card.rank) - 1
        ) {
            return pile;
        }
    });
}
