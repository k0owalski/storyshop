import { LightningElement, api } from 'lwc';

import basePath from '@salesforce/community/basePath';

import { createMessageContext, releaseMessageContext, publish } from 'lightning/messageService';
import cartMessageChannel from '@salesforce/messageChannel/cart__c';

export default class BookCard extends LightningElement {
    @api book;

    messageContext = createMessageContext();

    disconnectedCallback() {
        releaseMessageContext(this.messageContext);
    }

    addToCart() {
        const cart = JSON.parse(window.localStorage.getItem('cart') ?? '[]');
        let yetInCart = false;

        cart.forEach(item => {
            if (item.id === this.book.id) {
                yetInCart = true;

                item.amount++;
            }
        });

        if (!yetInCart)
            cart.push({
                amount: 1,
                availability: parseInt(this.book.availability, 10),
                id: this.book.id,
                price: parseFloat(this.book.price),
                stackPrice: parseFloat(this.book.price),
                thumbnail: this.book.thumbnail,
                title: this.book.title,
            });

        window.localStorage.setItem('cart', JSON.stringify(cart));

        publish(this.messageContext, cartMessageChannel);
    }

    get detailPageLink() {
        return basePath + '/book/' + this.book.id;
    }
}
