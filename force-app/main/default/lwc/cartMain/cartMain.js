import { LightningElement, track } from 'lwc';
import basePath from '@salesforce/community/basePath';

import { createMessageContext, releaseMessageContext, publish } from 'lightning/messageService';
import cartMessageChannel from '@salesforce/messageChannel/cart__c';

export default class CartMain extends LightningElement {
    @track cart = [];
    @track cartValue = 0;

    messageContext = createMessageContext();

    connectedCallback() {
        const cartData = JSON.parse(window.localStorage.getItem('cart') ?? '[]');

        cartData.forEach(cartDataItem => {
            this.cart.push({
                amount: cartDataItem.amount,
                availability: cartDataItem.availability,
                id: cartDataItem.id,
                price: cartDataItem.price,
                stackPrice: cartDataItem.stackPrice,
                thumbnail: cartDataItem.thumbnail,
                title: cartDataItem.title,
                url: basePath + '/book/' + cartDataItem.id
            });
        });

        this.calculateCartValue();
    }

    disconnectedCallback() {
        releaseMessageContext(this.messageContext);
    }

    amountSubtractClick(event) {
        const amount = this.cart[event.target.dataset.index].amount;

        if (amount === 1) {
            this.cart.splice(event.target.dataset.index, 1);

            this.calculateCartValue();
            publish(this.messageContext, cartMessageChannel);
        } else {
            const availability = this.cart[event.target.dataset.index].availability;
            this.cart[event.target.dataset.index].amount = Math.min(Math.max(1, amount - 1), availability);
            this.calculateCartValue();
        }
    }

    amountChange(event) {
        const amount = event.target.value;
        const availability = this.cart[event.target.dataset.index].availability;
        this.cart[event.target.dataset.index].amount = Math.min(Math.max(1, amount), availability);

        this.calculateCartValue();
    }

    amountAddClick(event) {
        const amount = this.cart[event.target.dataset.index].amount;
        const availability = this.cart[event.target.dataset.index].availability;
        this.cart[event.target.dataset.index].amount = Math.min(Math.max(1, amount + 1), availability);

        this.calculateCartValue();
    }

    calculateCartValue() {
        this.cartValue = 0;

        this.cart.forEach((cartItem) => {
            cartItem.stackPrice = parseFloat((cartItem.amount * cartItem.price).toFixed(2));

            this.cartValue += cartItem.stackPrice;
        });

        this.cartValue = parseFloat(this.cartValue.toFixed(2));

        window.localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    setNewOrder() {
        const products = this.cart.map(cartItem => ({
            id: cartItem.id,
            amount: cartItem.amount.toString()
        }));

        console.log(products);

        window.localStorage.setItem('order', JSON.stringify({
            contact: null,
            name: null,
            phone: null,
            street: null,
            postal: null,
            city: null,
            price: this.cartValue,
            products: products
        }));
    }

    get orderPageLink() {
        return basePath + '/order';
    }
}
