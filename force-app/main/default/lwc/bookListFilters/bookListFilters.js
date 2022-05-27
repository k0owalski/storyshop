import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

import { createMessageContext, releaseMessageContext, publish } from 'lightning/messageService';
import filterMessageChannel from '@salesforce/messageChannel/filters__c';

export default class BookListFilters extends LightningElement {
    filterSettings = {
        filterName: 'Default',
        category: '',
        page: '1',
        itemsPerPage: '25',
        pageCount: '1',
        minPrice: '0',
        maxPrice: '0',
        orderBy: 'Name ASC',
        flag: ''
    };
    messageContext = createMessageContext();

    orderByOptions = [
        { label: 'Tytuł: rosnąco', value: 'Name ASC' },
        { label: 'Tytuł: malejąco', value: 'Name DESC' },
        { label: 'Cena: rosnąco', value: 'Price__c ASC' },
        { label: 'Cena: malejąco', value: 'Price__c DESC' },
    ];

    itemsPerPageOptions = [
        { label: '25', value: '25' },
        { label: '50', value: '50' },
        { label: '100', value: '100' },
        { label: '200', value: '200' },
    ];

    @wire(CurrentPageReference)
    getPageReference({ state }) {
        this.filterSettings.filterName = state.filterName ? state.filterName : this.filterSettings.filterName;
        this.filterSettings.category = state.category ? state.category : this.filterSettings.category;
        this.filterSettings.page = state.page ? state.page : this.filterSettings.page;
        this.filterSettings.itemsPerPage = state.itemsPerPage ? state.itemsPerPage : this.filterSettings.itemsPerPage;
        this.filterSettings.minPrice = state.minPrice ? state.minPrice : this.filterSettings.minPrice;
        this.filterSettings.maxPrice = state.maxPrice ? state.maxPrice : this.filterSettings.maxPrice;
        this.filterSettings.orderBy = state.orderBy ? state.orderBy : this.filterSettings.orderBy;
        this.filterSettings.flag = state.flag ? state.flag : this.filterSettings.flag;
    }

    disconnectedCallback() {
        releaseMessageContext(this.messageContext);
    }

    orderByOnChange(event) {
        this.filterSettings.orderBy = event.detail.value;
        publish(this.messageContext, filterMessageChannel, this.filterSettings);
    }

    itemsPerPageOnChange(event) {
        this.filterSettings.itemsPerPage = event.detail.value;
        publish(this.messageContext, filterMessageChannel, this.filterSettings);
    }

    minPriceOnChange(event) {
        this.filterSettings.minPrice = event.detail.value;
        publish(this.messageContext, filterMessageChannel, this.filterSettings);
    }

    maxPriceyOnChange(event) {
        this.filterSettings.maxPrice = event.detail.value;
        publish(this.messageContext, filterMessageChannel, this.filterSettings);
    }
}
