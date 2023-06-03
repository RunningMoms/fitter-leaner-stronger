var TRAFFICJAM_DOMAIN = 'IO2130315041';
var focus_offer_key;
var focus_offer_amount;
var stripeHandler = StripeCheckout.configure({
    key: 'pk_live_Hgrz280w9D3yOOPfipK2PaHr',
    image: 'media/Stripe-128x128.png',
    locale: 'auto',

    opened: function () {
    },
    closed: function () {
    },

    token: function (token) {
        token.event = 'stripeToken';
        token.offer = focus_offer_key;
        broadcast(token);
    }
});

function showStripe(amount, currency, description, offer_key) {
    focus_offer_amount = parseInt(amount) / 100;
    amount *= 100;
    focus_offer_key = offer_key;
    stripeHandler.open({
        name: 'RunningMoms',
        amount,
        currency,
        description,

        billingAddress: true,
        shippingAddress: false,
        allowRememberMe: false,
    });
}

function trafficJamEventHandler(message) {
    try {
        message = JSON.parse(message.data);
    } catch (e) {
        return;
    }

    if (typeof message.package == 'undefined' || message.package != 'trafficjam' || typeof message.message == 'undefined') {
        return;
    }

    if (message.http_status != 200) {
        Swal.fire({
            title: 'Try Again!',
            text: message.message,
            icon: 'error',
            confirmButtonText: 'Close'
        });
    } else {
        startConfetti();
        Swal.fire({
            title: 'Success!',
            text: 'Please check your email for further details.',
            icon: 'success',
            confirmButtonText: 'Close'
        });
    }
}

// @TODO TAREK: less code
//document.addEventListener("DOMContentLoaded", function () {
    bindEvent(window, "message", trafficJamEventHandler);
//});

function deferImgs() {
    Array
        .from(document.querySelectorAll("img[data-src-defer]"))
        .forEach((element) => {
            element.setAttribute("src", element.dataset.srcDefer);
        });
}
window.addEventListener("load", deferImgs);
