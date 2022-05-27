import { LightningElement } from 'lwc';
import story_shop_images from '@salesforce/resourceUrl/story_shop_images';
import getBannerSlides from '@salesforce/apex/bannerController.getBannerSlides';

export default class Banner extends LightningElement {
  slidesLoaded;
  slides;

  connectedCallback() {
    getBannerSlides()
      .then(receivedSlides => {
        this.slides = [...receivedSlides].map(slide => ({
          id: slide.Id,
          title: slide.Name,
          subtitle: slide.Subtitle__c,
          src: story_shop_images + slide.File_Name__c,
          href: slide.Href__c,
        }));

        this.slidesLoaded = true;
      })
      .catch();
  }

  get slideStyle() {
    return null;
  }
}
