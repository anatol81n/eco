import Form from "./form";
import {MaskInput} from "maska";
import cardValidator from "card-validator";

export default class {
    constructor(wrapper) {
        import("../css/app.css")
        this.wrapper = wrapper;
    }
    create() {
        const form = new Form();
        this.wrapper.append(form.dom);
        form.InputsEventHandlers = {
            cardNumber: cardNumberEventHandlers(form),
            cardDate: cardDateEventHandlers(form),
            cardCode: cardCodeEventHandlers(form),
            email: emailEventHandler(form),
        };
        setInputMasks(form.dom);
    }
}

let cardCodeLength = 3;
let cardNumberMask = "#### #### #### ####";
let cardType = null;

const cardNumberEventHandlers = form => ({
    "blur": event => {
        const input = event.target;
        const card = cardValidator.number(input.value);
        if (card.isValid) {
            form.setValidInput(input.name);
            validate(form);
        } else {
            input.classList.add("error");
            form.setInvalidInput(input.name);
        }
    },
    "input": event => {
        event.target.classList.remove("error");
        const card = cardValidator.number(event.target.value);
        if (!card.card) {
            cardType = null;
            form.cardType = null;
        }
        if (card.card && cardType !== card.card.type) {
            cardType = card.card.type;
            form.cardType = cardType;
            cardCodeLength = card.card.code.size;
            cardNumberMask = getCardNumberMask(card.card);
        }
    }
});

const cardCodeEventHandlers = form => ({
    "blur": event => {
        const input = event.target;
        if (cardValidator.cvv(input.value, cardCodeLength).isValid) {
            form.setValidInput(input.name);
            validate(form);
        } else {
            input.classList.add("error");
            form.setInvalidInput(input.name);
        }
    },
    "input": event => {
        event.target.classList.remove("error");
    }
});

const cardDateEventHandlers = form => ({
    "blur": event => {
        const input = event.target;
        const matches = input.value.match(/^(\d\d)\/(\d\d)$/);
        if (matches) {
            const month = Number(matches[1]);
            const year = Number(matches[2]);
            const now = new Date();
            const monthNow = now.getMonth() + 1;
            const yearNow = now.getFullYear() % 100;
            if ((year === yearNow && month > monthNow || year > yearNow) && 0 < month && month < 13) {
                form.setValidInput(input.name);
                validate(form);
                return;
            }
        }
        input.classList.add("error");
        form.setInvalidInput(input.name);
    },
    "input": event => {
        event.target.classList.remove("error");
    }
});

const emailEventHandler = form => ({
    "blur": event => {
        const input = event.target;
        const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
        if (EMAIL_REGEXP.test(input.value)) {
            form.setValidInput(input.name);
            validate(form);
        } else {
            input.classList.add("error");
            form.setInvalidInput(input.name);
        }
    },
    "input": event => {
        event.target.classList.remove("error");
    }
});

const setInputMasks = form => {
    new MaskInput(form.elements.cardDate, {
        mask: "##/##",
        eager: true,
    });
    new MaskInput(form.elements.cardCode, {
        mask: () => "#".repeat(cardCodeLength),
    });
    new MaskInput(form.elements.cardNumber, {
        mask: () => cardNumberMask,
        eager: true,
    });
}

const getCardNumberMask = card => {
    const gaps = [...card.gaps, card.lengths[card.lengths.length - 1]];
    return gaps.map((gap, index) => {
        const prev = gaps[index - 1] || 0;
        return "#".repeat(gap - prev);
    }, "").join(" ");
}

const validate = form => {
    if (form.isValid) {
        form.enableSubmitButton();
    } else {
        form.disableSubmitButton();
    }
}
