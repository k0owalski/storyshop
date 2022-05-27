import { LightningElement, api } from 'lwc';
import basePath from '@salesforce/community/basePath';

export default class Navigation extends LightningElement {
  @api navigationItems;

  get searchLink() {
    return basePath + '/book/Book__c/';
  }
}
