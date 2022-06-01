import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

import currentUserId from '@salesforce/user/Id';
import basePath from '@salesforce/community/basePath';

import { createMessageContext, releaseMessageContext, subscribe } from 'lightning/messageService';
import cartMessageChannel from '@salesforce/messageChannel/cart__c';

import getUserName from '@salesforce/apex/UserInformationController.getUserName';
import getNavigationItems from '@salesforce/apex/NavigationController.getNavigationItems';

export default class Navbar extends NavigationMixin(LightningElement) {
    currentUserName;

    cartLength;

    navigationItems = [];
    navigationItemsLoaded = false;

    messageContext = createMessageContext();

    connectedCallback() {
        if (this.userId) {
            getUserName()
                .then(response => {
                    this.currentUserName = response;
                })
                .catch();
        }

        getNavigationItems()
            .then((navItems) => {
                this.navigationItems = navItems.map(item => ({
                    id: item.Id,
                    name: item.Name,
                    url: basePath + item.URL__c
                }));

                this.navigationItemsLoaded = true;
            })
            .catch();

        this.getCartLength();
        subscribe(this.messageContext, cartMessageChannel, () => this.getCartLength());
    }

    disconnectedCallback() {
        releaseMessageContext(this.messageContext);
    }

    getCartLength() {
        const cartData = JSON.parse(window.localStorage.getItem('cart'));
        this.cartLength = cartData && cartData.length;
    }

    userMenuToggle() {
        console.log('%c User Menu toggle', 'color: aqua');
    }

    mobileMenuClick() {
        this.isMobileMenuActive = !this.isMobileMenuActive;
    }

    navigateToCart() {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Cart__c'
            }
        });
    }

    navigateToHome() {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Home'
            }
        });
    }

    navigateToLogin() {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Login'
            }
        });
    }

    get userId() {
        return currentUserId;
    }

    get userName() {
        return this.currentUserName;
    }
}
