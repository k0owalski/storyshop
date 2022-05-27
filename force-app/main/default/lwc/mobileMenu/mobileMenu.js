import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class MobileMenu extends NavigationMixin(LightningElement) {
    @api navigationItems;
    @api userId;
    @api userName;
    @api cartLength;
    @api isActive;


    navigateToCart() {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Cart__c'
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

    navigateToUserPanel() {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'User_Panel__c'
            }
        });
    }

    get formattedCartLength() {
        return this.cartLength || 0;
    }

    get mobileMenuClassList() {
        return this.isActive ? 'mobile-menu active' : 'mobile-menu';
    }
}
