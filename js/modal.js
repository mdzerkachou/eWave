

class Modal {

    constructor( props ){
        this.modalId = document.getElementById(props.modalId);
        this.modalOpen = false;
        this.init();


    }

    init() {

        this.getButtons();
        this.getTabs();
        this.getForms();

        this.buttonsEventInit();
        this.closeEvent();
        this.changeTabsEvent();
        this.eyeEventInit();
        this.submitFormEvent();

    }

    getButtons(){
        if( this.modalId ){
            this.buttons = document.querySelectorAll('[data-modal-btn]');
        } else {
            throw new Error("Element is not defined ");
        }

    }

    getTabs(){
        if( this.buttons ){
            this.tabs = document.querySelectorAll('[data-modal-tab]');
        } else {
            throw new Error("Tabs is not defined ");
        }
    }

    getForms(){
        if( this.tabs ){
            this.forms = document.querySelectorAll('[data-modal-form]');
        } else {
            throw new Error("Forms is not defined ");
        }
    }

    changeTabsEvent(){

        for( let tab of this.tabs){
            tab.addEventListener('click', () => {

                const tabName = tab.getAttribute('data-modal-tab');
                const allForms = this.modalId.querySelectorAll(`[data-modal-form]`);
                const formActive = this.modalId.querySelector(`[data-modal-form=${tabName}]`);
                const subTab = this.modalId.querySelectorAll(`[data-modal-tab=${tabName}]`);


                for(let tab of this.tabs){
                    tab.classList.remove('active');
                }

                for(let sub of subTab) {
                    if(!sub.getAttribute('data-sub-tab')){
                        sub.classList.add('active');
                    }
                }

                tab.classList.add('active');
                this.changeFormEvent(allForms, formActive);

            });
        }
    }

    changeFormEvent(forms, currentForm){
        for(let form of forms){
            form.classList.remove('active');
        }
        currentForm.classList.add('active');
    }

    buttonsEventInit(){
        if( this.buttons ){
            const btns = this.buttons;
            for( let item of btns ){
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.modalOpen = true;
                    this.openModal();
                    this.setActiveTab(item);
                });
            }
        }
    }

    submitFormEvent(){
        const btns = this.modalId.querySelectorAll('button');

        for( let btn of btns){
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const form = btn.closest('form');
                const notifyMessage = form.getAttribute('data-message');
                const fieldLength = form.querySelectorAll('input').length;
                const fieldSuccess = form.querySelectorAll('input.success').length;

                if (fieldSuccess === fieldLength ){
                    this.notifyMessage(true, notifyMessage);
                    setTimeout( () => {
                        this.quickCloseModal();
                        this.notifyMessage(false);
                    }, 2000);
                    return true;
                }
            });
        }

    }

    notifyMessage(state, message){
        const notify = document.querySelector('.modal-notify');
        const notifyTitle = notify.querySelector('h5');
        notifyTitle.innerText = message || '';

        if(state){
            notify.classList.add('active');
            return true;
        }
        notify.classList.remove('active');

    }

    openModal(){
        this.modalId.classList.add('open');
        this.modalOpen = true;

    }

    quickCloseModal(modal){
        const bg = this.modalId;
        const forms = bg.querySelectorAll(`[data-modal-form]`);

        this.modalId.classList.remove('open');
        this.cleanStateModal();
        this.modalOpen = false;
        this.cleanForms(forms);
        this.cleanEyeState();
    }


    closeEvent(){

        const bg = this.modalId;
        const forms = bg.querySelectorAll(`[data-modal-form]`);

        bg.addEventListener('click', (e) => {

            if(!e.target.matches("#modal, .modal")){
                return true;
            }

            this.modalId.classList.remove('open');
            this.cleanStateModal();
            this.modalOpen = false;
            this.cleanForms(forms);
            this.cleanEyeState();

        });

        window.onkeydown = (e) => {
            e = e || window.event;
            if (e.key==='Escape'||e.key==='Esc') {
                this.modalId.classList.remove('open');
                this.cleanStateModal();
                this.modalOpen = false;
                this.cleanForms(forms);
                this.cleanEyeState();
            }
        };

    }

    eyeEventInit(){
        const eyes = this.modalId.querySelectorAll('.modal-eye');

        for(let eye of eyes){

            const input = eye.parentElement.querySelector('input');

            eye.addEventListener('click', (e) => {
                eye.classList.toggle('hide');

                if( input.type === 'password' ){
                    input.type = 'text';
                } else {
                    input.type = 'password';
                }

            }, true);
        }
    }

    cleanEyeState(){
        const eyes = this.modalId.querySelectorAll('.modal-eye');

        for(let eye of eyes){
            eye.classList.add('hide');
            const input = eye.parentElement.querySelector('input');
            input.type = 'password';
        }
    }

    cleanForms(forms){

        for(let form of forms){
            const elements = form.querySelectorAll('input');
            const errors = form.querySelector('.modal-errors');
            errors.innerHTML = '<ul></ul>';

            for(let el of elements){
                el.value = "";
                el.classList.remove('success');
                el.classList.remove('error');
            }
        }
    }

    cleanStateModal(){
        const modalId = document.getElementById(props.modalId);
        const tabActive = modalId.querySelectorAll(`[data-modal-tab]`);
        const formActive = modalId.querySelectorAll(`[data-modal-form]`);

       for( let tab of tabActive ){
           tab.classList.remove('active');
        }

        for( let form of formActive ){
            form.classList.remove('active');
        }
    }

    setActiveTab(item){

        const modalId = document.getElementById(props.modalId);
        const itemAttr = item.getAttribute('data-modal-btn');
        const tabActive = modalId.querySelector(`[data-modal-tab=${itemAttr}]`);
        const formActive = modalId.querySelector(`[data-modal-form=${itemAttr}]`);

        if(tabActive){
            tabActive.classList.add('active');
        }

        if(formActive) {
            formActive.classList.add('active');
        }

    }
}
