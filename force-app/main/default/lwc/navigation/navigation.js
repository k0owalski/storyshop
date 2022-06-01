import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

import basePath from '@salesforce/community/basePath';

export default class Navigation extends NavigationMixin(LightningElement) {
  @api navigationItems;
  @api cartLength;

  navigateToCart() {
    this[NavigationMixin.Navigate]({
      type: 'comm__namedPage',
      attributes: {
        name: 'Cart__c'
      }
    });
  }

  get searchLink() {
    return basePath + '/book/Book__c/';
  }

  get cartItemLength() {
    return this.cartLength;
  }
}
