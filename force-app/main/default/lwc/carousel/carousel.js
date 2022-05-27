import { LightningElement, api } from 'lwc';

import basePath from '@salesforce/community/basePath';
import story_shop_images from '@salesforce/resourceUrl/story_shop_images';

import getBooksByFlag from '@salesforce/apex/carouselController.getBooksByFlag';

export default class Carousel extends LightningElement {
  @api flag;
  @api sectionName;

  booksLoaded = false;
  books;

  connectedCallback() {
    getBooksByFlag({ flag: this.flag })
      .then(receivedBooks => {
        this.books = receivedBooks.map(bookData => ({
          id: bookData.Id,
          title: bookData.Name,
          description: bookData.Description__c,
          price: parseFloat(bookData.Price__c),
          thumbnail: story_shop_images + bookData.Thumbnail__c,
          categoryId: bookData.Category__c,
          categoryName: bookData.Category__r.Name,
          author: bookData.Author__r.Name,
          availability: parseInt(bookData.Availability__c, 10),
        }));
        this.booksLoaded = true;
      })
      .catch();
  }

  get readMoreLink() {
    return basePath + '/book/Book__c/Default?flag=' + this.flag;
  }
}
