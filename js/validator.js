
class Validator {
    constructor(form){
        this.forms = document.getElementById(props.modalId).querySelectorAll('[data-modal-form]');
        this.init(this.forms);

        this.regObj = {
            text: /^[a-zA-Z].{2,}$/,
            email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/
        };
    }

    init(forms){

        for( let form of forms){
            this.bindFields(form);
        }

    }

    bindFields(fields){
        for(let field of fields){

            if(field.nodeName === 'INPUT'){
                const inputType = field.type;

                switch(inputType) {

                    case 'text':
                        this.textValid(field);
                        break;

                    case 'password':
                        this.passwordValid(field);
                        break;

                    case 'email':
                        this.emailValid(field);
                         break;

                }
            }
        }
    }

    lengthCheck(str){
        return str.length >= 3;
    }

    passwordValid(input){
        const password = input.getAttribute('data-password');
        const confirm = input.getAttribute('data-confirm-password');

        const form = input.closest('form');
        const val = input.value;


        if(password){

            input.addEventListener('blur', () => {
                const passwordEl = form.querySelector('[data-password]');
                const confirmEl = form.querySelector('[data-confirm-password]');

                if( form.querySelectorAll('[data-confirm-password]').length > 0 ){
                    if( confirmEl.classList.contains('success') && !this.comparisonValue(passwordEl.value, confirmEl.value) ){
                        this.errorEmitter( confirmEl, false);
                        confirmEl.focus();
                    }
                }

                if(this.lengthCheck(input.value)) {
                   if(input.value.search(/\d/) == -1){
                       this.errorEmitter( input, false);
                        return false;
                   } else if(input.value.search(/[a-zA-Z]/) == -1) {
                       this.errorEmitter( input, false);
                        return false;
                   }
                     else {
                       this.errorEmitter( input, true);
                       this.removeErrorFromList(input, 'password-error');
                   }
                } else {
                    this.errorEmitter( input, false);
                }
            });
        }
        if(confirm){


            input.addEventListener('blur', () => {

                const comValue = input.closest('form').querySelector('[data-password]').value;

                if(this.lengthCheck(input.value)) {
                    if(input.value.search(/\d/) == -1){
                        this.errorEmitter( input, false);
                        return false;
                    } else if(input.value.search(/[a-zA-Z]/) == -1) {
                        this.errorEmitter( input, false);
                        return false;
                    }
                    else if(this.comparisonValue(input.value, comValue)){
                        this.errorEmitter( input, true);
                        this.removeErrorFromList(input, 'confirm-error');
                    } else {
                        this.errorEmitter( input, false);
                    }
                } else {
                    this.errorEmitter( input, false);
                }
            });

        }

    }

    comparisonValue(first, second){
        return first === second;
    }

    emailValid(input){
        input.addEventListener('blur', () => {

            const val = input.value;
            if(this.lengthCheck(input.value) && this.regObj.email.test(val)){
                this.removeErrorFromList(input, 'email-error');
                this.errorEmitter( input, true);
                return true;
            }
            this.errorEmitter( input, false);
        });
    }

    textValid(input){

        input.addEventListener('blur', () => {

            const val = input.value;
            if(this.lengthCheck(input.value) && this.regObj.text.test(val)){
                this.removeErrorFromList(input, 'username-error');
                this.errorEmitter( input, true);
                return true;
            }
            this.errorEmitter( input, false);

        });

    }


    errorEmitter(input, state){

        if(state){
            input.classList.remove('error');
            input.classList.add('success');
        } else {
            input.classList.add('error');
            input.classList.remove('success');

            this.addErrorList(input);
        }

    }
    addErrorList(input){
        const inputType = input.type;
        const errorList = input.closest('form').querySelector('.modal-errors ul');
        const listElement = document.createElement('li');
        const errorsText = {
          text: 'Username must consist of letters of the latin alphabet and numbers, begin with a letter, be no shorter than 3 characters',
          email: 'Email must be valid and not shorter than 3 characters',
          password: 'Password must be no shorter than 3 characters and contain at least 1 Latin letter and at least 1 digit',
          confirm: 'Passwords do not match or password is not valid'
        };
        const errorClass = {
            text: 'username-error',
            email: 'email-error',
            password: 'password-error',
            confirm: 'confirm-error'
        };

        if(!input.hasAttribute('data-password') && inputType === 'text' && this.checkErrorInList(errorList, errorClass.text)){
            listElement.innerHTML = errorsText.text;
            listElement.className = errorClass.text;
            errorList.appendChild(listElement);
            return true;
        }

        if(inputType === 'email' && this.checkErrorInList(errorList, errorClass.email)){
            listElement.innerHTML = errorsText.email;
            listElement.className = errorClass.email;
            errorList.appendChild(listElement);
            return true;
        }

        if(inputType === 'text' || inputType === 'password' && input.getAttribute('data-password') && this.checkErrorInList(errorList, errorClass.password)){
            listElement.innerHTML = errorsText.password;
            listElement.className = errorClass.password;
            errorList.appendChild(listElement);
            return true;
        }

        if(inputType === 'password' && input.getAttribute('data-confirm-password') && this.checkErrorInList(errorList, errorClass.confirm)){
            listElement.innerHTML = errorsText.confirm;
            listElement.className = errorClass.confirm;
            errorList.appendChild(listElement);
            return true;
        }

    }
    checkErrorInList(list, classError){
        const error = list.querySelector(`li.${classError}`);
        return !error;

    }
    removeErrorFromList(input, type){
        const error = input.closest('form').querySelector(`.modal-errors ul li.${type}`);
        if(error){
            error.remove();
        }
    }
}
