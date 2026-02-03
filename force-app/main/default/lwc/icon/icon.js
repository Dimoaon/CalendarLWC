import { LightningElement, api } from 'lwc';

import arrow from './icons/arrow';
import plus from './icons/plus';
import close from './icons/close';
import search from './icons/search';

const ICONS = { arrow, plus, close, search };

export default class Icon extends LightningElement {
    @api name;

    renderedCallback() {
        const container = this.template.querySelector('.icon-container');

        if (!container || !ICONS[this.name]) {
            return;
        }

        container.innerHTML = ICONS[this.name];
    }
}
