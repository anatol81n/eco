import {makel, evans} from "makel-dom";

export default class {
    constructor() {
        this._form = makel("form.form-container",
            makel("div.field-container",
                makel("label[for=cardNumber]", "Номер карты"),
                makel("input[id=cardNumber][type=text][name=cardNumber]"),
                makel("div.ccicon[id=cardTypeIcon]")
            ),
            makel("div.field-container",
                makel("label[for=cardDate]", "Дата"),
                makel("input[id=cardDate][type=text][name=cardDate]")
            ),
            makel("div.field-container",
                makel("label[for=cardCode]", "Код"),
                makel("input[id=cardCode][type=text][name=cardCode]")
            ),
            makel("div.field-container",
                makel("label[for=email]", "Email"),
                makel("input[id=email][type=text][name=email]")
            ),
            makel("button[type=submit][name=submit][disabled=disabled]", "Оплатить"),
            makel("div", makel("a[href=https://www.vccgenerator.org/ru/][target=_blank]", "генератор карт"))
        );
        this._valid = {
            cardNumber: false,
            cardDate: false,
            cardCode: false,
            email: false
        }
    }

    get dom() {
        return this._form;
    }

    set InputsEventHandlers(elements) {
        for (const elementName in elements) {
            if (this.dom.elements[elementName]) {
                for (const handleName in elements[elementName]) {
                    evans(this.dom.elements[elementName], {
                        [handleName]: elements[elementName][handleName]
                    });
                }
            }
        }
    }

    setValidInput(input) {
        this._valid[input] = true;
    }

    setInvalidInput(input) {
        this._valid[input] = false;
    }

    enableSubmitButton() {
        this.dom.querySelector("button[type=submit]").disabled = false;
    }
    disableSubmitButton() {
        this.dom.querySelector("button[type=submit]").disabled = true;
    }

    get isValid() {
        let result = true;
        for (const current in this._valid) {
            result = result && this._valid[current];
        }
        return result;
    }

    set cardType(cardType) {
        this.dom.querySelector("#cardTypeIcon").style.backgroundImage = cardType && cardTypeImages[cardType] ? `url(${cardTypeImages[cardType]})` : "";
    }
}

const cardTypeImages = {
    "visa": "img/visa.png",
    "mastercard": "img/mastercard.png",
    "american-express": "img/amex.png",
    "unionpay": "img/unionpay.png",
    "maestro": "img/maestro.png",
    "mir": "img/mir.png"
}

