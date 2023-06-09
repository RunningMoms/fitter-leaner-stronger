var focus_offer_key;
var focus_offer_amount;
var try_again;

var stripeHandler = StripeCheckout.configure({
    key: STRIPE_KEY,
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
        name: STRIPE_TITLE,
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

        if (try_again != undefined) {

            Swal.fire({
                title: 'No worries. Try one more time,<br/>then just contact me.',
                text: message.message,
                icon: 'error',
                confirmButtonText: 'Try Again',
                showCancelButton: true,
                cancelButtonText: 'Contact Carey',
                allowOutsideClick: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    showStripe(try_again);
                    window.try_again = undefined;
                } else {
                    window.location.href = 'mailto:carey@runningmoms.com';
                }
            });
        } else {
            Swal.fire({
                title: 'No worries. Just contact me.<br/>I\'ll get you setup!',
                text: message.message,
                icon: 'error',
                confirmButtonText: 'Contact Carey',
                allowOutsideClick: false,
            }).then((result) => {
                window.location.href = 'mailto:carey@runningmoms.com';
                Swal.close();
            });
        }
    } else {
        queConfetti();
        let el = Swal.fire({
            title: 'Success!',
            text: 'Please check your email for further details.',
            icon: 'success',
            confirmButtonText: 'Close'
        });

        console.log(el);
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

window.addEventListener("load", deferImgs());


function queConfetti() {
    var canvas = document.getElementById('confetti-canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';
    startConfetti();
    var interval = setInterval(function () {
        party.sparkles(canvas);
        party.sparkles(canvas);
        party.sparkles(canvas);
        party.sparkles(canvas);
    }.bind(canvas), 500);

    setTimeout(function () {
        cleanupConfetti();
        clearInterval(interval)
    }.bind(interval), 4000);

}

function cleanupConfetti() {
    var canvas = document.getElementById('confetti-canvas');
    var opacity = 1;
    var fadeInterval = setInterval(function () {
        if (opacity > 0) {
            opacity -= 0.05; // Adjust the fading speed here
            canvas.style.opacity = opacity;
        } else {
            clearInterval(fadeInterval);
            canvas.style.display = 'none';
        }
    }, 50); // Adjust the fading interval here

    // Set display to 'none' after fade out is complete
    setTimeout(function () {
        canvas.style.display = 'none';
        canvas.style.opacity = 1;
    }, 50 * 20); // Adjust the delay here (50ms * 20 = 1000ms = 1 second)
}


