import { LightningElement, api } from 'lwc';

import { createMessageContext, releaseMessageContext, publish } from 'lightning/messageService';
import cartMessageChannel from '@salesforce/messageChannel/cart__c';

import getBookData from '@salesforce/apex/bookDetailController.getBookData';

import basePath from '@salesforce/community/basePath';
import story_shop_images from '@salesforce/resourceUrl/story_shop_images';

export default class BookDetailMain extends LightningElement {
    @api recordId;

    book;
    bookLoaded = false;

    amount = 1;
    categoryLink;

    messageContext = createMessageContext();

    connectedCallback() {
        getBookData({ bookId: this.recordId })
            .then(bookData => {
                this.book = {
                    id: bookData[0].Id,
                    title: bookData[0].Name,
                    description: bookData[0].Description__c,
                    price: parseFloat(bookData[0].Price__c),
                    thumbnail: story_shop_images + bookData[0].Thumbnail__c,
                    categoryId: bookData[0].Category__c,
                    categoryName: bookData[0].Category__r.Name,
                    author: bookData[0].Author__r.Name,
                    availability: parseFloat(bookData[0].Availability__c),
                }

                this.categoryLink = basePath + '/book/Book__c/Default?category[]=' + this.book.categoryId;
                this.bookLoaded = true;
            })
            .catch();
    }

    disconnectedCallback() {
        releaseMessageContext(this.messageContext);
    }

    addToCart() {
        const cart = JSON.parse(window.localStorage.getItem('cart') ?? '[]');
        let yetInCart = false;

        cart.forEach(item => {
            if (item.id === this.book.id) {
                yetInCart = true;

                item.amount += this.amount;
            }
        });

        if (!yetInCart)
            cart.push({
                id: this.book.id,
                title: this.book.title,
                thumbnail: this.book.thumbnail,
                price: this.book.price,
                availability: this.book.availability,
                amount: 1,
                url: basePath + '/book/' + this.book.id,
            });

        window.localStorage.setItem('cart', JSON.stringify(cart));

        publish(this.messageContext, cartMessageChannel);
    }

    amountSubtractClick() {
        this.amount = Math.min(Math.max(1, this.amount - 1), this.book.availability);
    }

    amountChange(event) {
        this.amount = Math.min(Math.max(1, event.target.value), this.book.availability);
    }

    amountAddClick() {
        this.amount = Math.min(Math.max(1, this.amount + 1), this.book.availability);
    }

    get bookListLink() {
        return basePath + '/book/Book__c/';
    }
}
