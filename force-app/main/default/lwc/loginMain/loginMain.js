import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation'

import login from '@salesforce/apex/UserLoginController.login';

export default class LoginForm extends NavigationMixin(LightningElement) {
    username;
    password;

    signIn() {
        login({
            username: this.username,
            password: this.password
        })
            .then(() => {
                this[NavigationMixin.Navigate]({
                    type: 'comm__namedPage',
                    attributes: {
                        name: 'Home'
                    }
                });
            })
            .catch();
    }

    fieldChange(event) {
        this[event.target.dataset.field] = event.target.value;
    }

    navigateToForgot() {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Forgot_Password'
            }
        });
    }

    navigateToRegister() {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'Register'
            }
        });
    }
}
