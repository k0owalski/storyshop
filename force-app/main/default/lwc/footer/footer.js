import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class Footer extends NavigationMixin(LightningElement) {

    navigateTo(event) {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: event.target.dataset.pageName
            }
        });
    }
}
