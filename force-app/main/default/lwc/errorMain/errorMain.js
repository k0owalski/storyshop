import { LightningElement } from 'lwc';
import basePath from '@salesforce/community/basePath';

export default class ErrorMain extends LightningElement {
    get homeLink() {
        return basePath;
    }
}
