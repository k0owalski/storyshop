import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

import story_shop_images from '@salesforce/resourceUrl/story_shop_images';

import getBookList from '@salesforce/apex/bookListController.getBookList';
import getBookCount from '@salesforce/apex/bookListController.getBookCount';

import { createMessageContext, releaseMessageContext, subscribe } from 'lightning/messageService';
import filterMessageChannel from '@salesforce/messageChannel/filters__c';

export default class BookList extends LightningElement {
    @track filterSettings = {
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

    bookList;
    bookListLoaded = false;

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

    connectedCallback() {
        this.bookListLoaded = false;
        this.reloadBooklist();

        subscribe(this.messageContext, filterMessageChannel, (filterSettings) => {
            this.filterSettings = { ...filterSettings };

            this.bookListLoaded = false;
            this.reloadBooklist();
        });
    }

    disconnectedCallback() {
        releaseMessageContext(this.messageContext);
    }

    reloadBooklist() {
        getBookList({
            filterName: this.filterSettings.filterName,
            category: this.filterSettings.category,
            minPrice: this.filterSettings.minPrice,
            maxPrice: this.filterSettings.maxPrice,
            recordLimit: this.filterSettings.itemsPerPage,
            recordOffset: ((parseInt(this.filterSettings.page, 10) - 1) * parseInt(this.filterSettings.itemsPerPage, 10)).toString(),
            orderBy: this.filterSettings.orderBy,
            flag: this.filterSettings.flag
        })
            .then(receivedBooks => {
                this.bookList = receivedBooks.map(bookData => ({
                    id: bookData.Id,
                    title: bookData.Name,
                    price: bookData.Price__c,
                    thumbnail: story_shop_images + bookData.Thumbnail__c,
                }));

                getBookCount()
                    .then(bookCount => {
                        this.filterSettings.pageCount = Math.ceil(bookCount / this.filterSettings.pageCount);

                        this.bookListLoaded = true;
                    })
                    .catch();
            })
            .catch();
    }
}
