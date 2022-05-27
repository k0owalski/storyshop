import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

import userId from '@salesforce/user/Id';

import createNewOrder from '@salesforce/apex/OrderController.createNewOrder';
import getContactFields from '@salesforce/apex/UserInformationController.getContactFields';

import { createMessageContext, releaseMessageContext, publish } from 'lightning/messageService';
import cartMessageChannel from '@salesforce/messageChannel/cart__c';

export default class OrderMain extends NavigationMixin(LightningElement) {
    order = {};
    @track contactData = {};
    contactDataLoaded = false;

    messageContext = createMessageContext();

    constructor() {
        super();

        this.order = JSON.parse(window.localStorage.getItem('order')) ?? {};
    }

    connectedCallback() {
        if (userId) {
            getContactFields()
                .then(contactData => {
                    this.contactData = {
                        contact: contactData.Id,
                        name: contactData.Name,
                        phone: contactData.Phone,
                        street: contactData.OtherStreet,
                        postal: contactData.OtherPostalCode,
                        city: contactData.OtherCity,
                    };

                    console.log(contactData);
                })
                .catch();
        } else {
            this.contactData = {
                contact: '',
                name: '',
                phone: '',
                street: '',
                postal: '',
                city: '',
            };
        }

        this.contactDataLoaded = true;
    }

    disconnectedCallback() {
        releaseMessageContext(this.messageContext);
    }

    createNewOrder() {
        createNewOrder({
            contactData: this.contactData,
            price: this.order.price,
            products: this.order.products
        })
            .then(response => {
                if (response === 'SUCCESS') {
                    window.localStorage.removeItem('order');
                    window.localStorage.removeItem('cart');

                    publish(this.messageContext, cartMessageChannel);

                    this[NavigationMixin.Navigate]({
                        type: 'comm__namedPage',
                        attributes: {
                            name: 'Home'
                        }
                    });
                }
            })
            .catch();
    }

    inputChange(event) {
        this.contactData[event.target.dataset.field] = event.target.value;
    }
}
