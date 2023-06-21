

    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    (function( jQuery ){
  // var $module = jQuery('#m-1678726285336').children('.module');
  // You can add custom Javascript code right here.
})( window.GemQuery || jQuery );
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  
    
  (function( jQuery ){
  // var $module = jQuery('#m-1684322260073').children('.module');
  // You can add custom Javascript code right here.
  /**
 * Universal parameters
 */
var PARAM_showAfter = parseInt("[[ {name: 'showAfter', tooltip: 'Time in milliseconds', category: 'Triggering', orderIndex: '12000', isJsonParam: true} : number | 0 ]]", 10);
var PARAM_removeAfter = parseInt("[[ {name: 'removeAfter', tooltip: 'Time in milliseconds', category: 'Triggering', orderIndex: '12001', isJsonParam: true} : number | 0 ]]", 10);
var PARAM_trigger = "[[ {name: 'trigger', tooltip: 'Triggering options. Be aware On exit option is not supported on mobile devices', category: 'Triggering', orderIndex: '12002', isJsonParam: true} : enum(On entry,On exit,On scroll) | On entry ]]";
var PARAM_parentElement = "[[ {name: 'parentElement', tooltip: 'NON', category: 'Position', orderIndex: '15000', isJsonParam: true} : string | BILLOUTE ]]";
var PARAM_positionVertical = "[[ {name: 'positionVertical', tooltip: '', category: 'Position', orderIndex: '15001', isJsonParam: true} : enum(Top,Center,Bottom) | TOP ]]";
var PARAM_positionHorizontal = "[[ {name: 'positionHorizontal', tooltip: '', category: 'Position', orderIndex: '15002', isJsonParam: true} : enum(Left,Center,Right) | Center ]]";
var PARAM_enterAnimation = "[[ {name: 'enterAnimation', tooltip: '', category: 'Position', orderIndex: '15003', isJsonParam: true} : enum(None,Fade in,Slide in) | None ]]";

/**
 * Template specific parameters
 */
var PARAM_smsRecipient = "[[ {name: 'SMS recipient', tooltip: 'This is the phone number customers will text in order to sign up for SMS messages from your brand', category: 'SMS', orderIndex: '10', isJsonParam: true} : string ]]";
var PARAM_smsMessage = "[[ {name: 'SMS message', tooltip: 'This is the prefilled SMS the customer will send to your SMS recipient', category: 'SMS', orderIndex: '10', isJsonParam: true} : string | By sending this message, I agree to receive recurring automated marketing messages, including cart reminders, from Bloomreach. ]]";
var PARAM_initialCountry = "[[ {name: 'initialCountry', tooltip: 'Country code of country that will be preselected in the dropdown (e.g. us)', category: 'Phone number validation', orderIndex: '100', isJsonParam: true} : string | us ]]";
var PARAM_preferredCountries = "[[ {name: 'preferredCountries', tooltip: 'Countries that will appear at the top of the list (e.g. us, gb)', category: 'Phone number validation', orderIndex: '100', isJsonParam: true} : string | us, ca, gb ]]";
var PARAM_onlyCountries = "[[ {name: 'onlyCountries', tooltip: 'If specified, only phone numbers from these countries will be allowed (e.g. us, gb), leave empty to allow all countries', category: 'Phone number validation', orderIndex: '100', isJsonParam: true} : string ]]";
var PARAM_invalidNumberMessage = "[[ {name: 'invalidPhoneNumberMessage', tooltip: 'Error message shown when invalid phone number is entered', category: 'Phone number validation', orderIndex: '100', isJsonParam: true} : string | Enter a valid phone number ]]";
var PARAM_consentCategoryEmail = "[[ {name: 'consentCategoryEmail', category: 'Consent category', orderIndex: '10001', isJsonParam: true} : text | newsletter ]]";
var PARAM_consentCategorySMS = "[[ {name: 'consentCategorySMS', category: 'Consent category', orderIndex: '10', isJsonParam: true} : text | sms ]]";


/**
 * Initialization
 */
var self = this;

// Helper Id used to identify the banner on the website, not actual ID of the banner
var bannerSemiId = Math.random().toString(36).substring(5);

// Used in onExit banners to mark if the banner was triggered already
window['__exp_triggered-' + bannerSemiId] = false;

// Resetting some of the parameters while previewing the banner in the app to easily see its appearance
if (self.inPreview) {
    // reset the show delay while editing the banner in editor
    PARAM_showAfter = 0;

    // always append the banner to the body itself
    PARAM_parentElement ='body';

    // always show the banner right away
    PARAM_trigger = 'On entry';
}

/**
 * Basic functions
 */

/**
 * Function used to register listener for the trigger that will display the banner
 */
function registerStartTrigger() {
    // Promise that is resolved when required dependencies are loaded
    window['__exp_load_promise-' + bannerSemiId] = Promise.all([
        loadStylesheet('https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/css/intlTelInput.css'),
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/intlTelInput.min.js')]
    );

    if (PARAM_trigger === 'On exit') {
        document.body.addEventListener('mouseout', onExitMouseOutHandler);
    } else if (PARAM_trigger === 'On scroll') {
        window.addEventListener('scroll', scheduleShowBanner);
    } else {
        // If 'On entry' or anything unknown start the banner right away
        scheduleShowBanner();
    }
}

/**
 * This function starts the showAfter timer and then displays the banner
 */
function scheduleShowBanner() {
    window.removeEventListener('scroll', scheduleShowBanner);
    window['__exp_load_promise-' + bannerSemiId].then(function () {
        setTimeout(function () {
            // Track show event after timer expired
            trackEvent('show', false);

            // Create and display the banner
            requestAnimationFrame(createBanner);

            // If removeAfter is provided start the removal timer
            if (PARAM_removeAfter > 0) {
                setTimeout(function () {
                    removeBanner();
                }, PARAM_removeAfter);
            }
        }, PARAM_showAfter);
    });
}

/**
 * Function used to insert the banner contents into the HTML and adding basic functionality
 */
function createBanner() {
    // select the parent element
    var parentElement = document.querySelector(PARAM_parentElement)

    // insert banner HTML into the website
    parentElement.insertAdjacentHTML('afterbegin', self.html);

    // get the banner reference
    var banner = parentElement.firstElementChild;
    self.banner = banner;

    // add close functionality to the close button
    banner.querySelector('.close').onclick = handleCloseButtonClick;

    // add close/decline functionality to the decline links
    var declineLinks = banner.querySelectorAll('.decline');
    for (var i = 0; i < declineLinks.length; i++) {
        declineLinks[i].onclick = handleCloseButtonClick;
    }

    // add classes specifying banner position and animation
    banner.className += ' ' + getPositionAndAnimationClasses();

    // insert banner CSS into the website
    banner.insertAdjacentHTML('afterbegin', '<style>' + self.style + '</style>');

    // track clicking on <a> in the banner
    var links = banner.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
        trackLink(links[i], 'click', true);
    }

    initializeStepOneForm(banner);
}

/**
 * Function used to remove the banner from the website
 */
function removeBanner() {
    if (self.banner && self.banner.parentNode) {
        self.banner.parentNode.removeChild(self.banner);
    }
}

/**
 * Function used to remove the banner from the website
 */
function removeBanner() {
    if (self.banner && self.banner.parentNode) {
        self.banner.parentNode.removeChild(self.banner);
    }
}

/**
 * Function triggered when the closing button is clicked
 * @param event - browser click Event
 * @returns {boolean}
 */
function handleCloseButtonClick(event) {
    removeBanner();
    trackEvent('close', true);

    // Stop the click event propagation onto parent HTML elements
    event.preventDefault();
    if (event.stopPropagation) {
        event.stopPropagation();
    } else {
        event.cancelBubble = true;
    }

    return false;
}

/**
 * Function used to track single action
 * @param action - string
 * @param interactive - boolean
 */
function trackEvent(action, interactive) {
    self.sdk.track('banner', getEventProperties(action, interactive));
}

/**
 * Function used to add action tracking to element
 * @param link - element
 * @param action - string
 * @param interactive - boolean
 */
function trackLink(link, action, interactive) {
    var eventData = getEventProperties(action, interactive);
    eventData.link = link.href;
    self.sdk.trackLink(link, 'banner', eventData);
}

/**
 * Default attributes tracked with every banner event
 * @param action - string
 * @param interactive - boolean
 * @returns object - object to be tracked
 */
function getEventProperties(action, interactive) {
    return {
        action: action,
        banner_id: self.data.banner_id,
        banner_name: self.data.banner_name,
        banner_type: self.data.banner_type,
        variant_id: self.data.variant_id,
        variant_name: self.data.variant_name,
        variant_origin: self.data.contextual_personalization != null ? 'contextual personalisation' : 'ABtest',
        interaction: interactive !== false,
    };
}

/**
 * Function used to start banners with onExit trigger
 * @param event - browser mouse event
 */
function onExitMouseOutHandler(event) {
    event = event ? event : window.event;
    var vpWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if (event.clientX >= (vpWidth)) {
        return;
    }
    if (event.clientY >= 50) {
        return;
    }
    var from = event.relatedTarget || event.toElement;

    if (!from && !window['__exp_triggered-' + bannerSemiId]) {
        window['__exp_triggered-' + bannerSemiId] = true;
        scheduleShowBanner();
    }
}

/**
 * Function that returns correct class
 */
function getPositionAndAnimationClasses() {
    var verticalClass = {
        Top: 'vertical-top',
        Center: 'vertical-center',
        Bottom: 'vertical-bottom',
    }[PARAM_positionVertical] || '';

    var horizontalClass = {
        Left: 'horizontal-left',
        Center: 'horizontal-center',
        Right: 'horizontal-right',
    }[PARAM_positionHorizontal] || '';

    var enterAnimationClass = {
        'Fade in': 'enter-fade',
        'Slide in': {
            Top: {
                Left: 'enter-slide-left',
                Center: 'enter-slide-up',
                Right: 'enter-slide-right',
            }[PARAM_positionHorizontal],
            Center: {
                Left: 'enter-slide-left',
                Center: 'enter-slide-up',
                Right: 'enter-slide-right',
            }[PARAM_positionHorizontal],
            Bottom: {
                Left: 'enter-slide-left',
                Center: 'enter-slide-down',
                Right: 'enter-slide-right',
            }[PARAM_positionHorizontal],
        }[PARAM_positionVertical],
    }[PARAM_enterAnimation] || '';

    return verticalClass + ' ' + horizontalClass + ' ' + enterAnimationClass;
}

/**
 * Template specific functions
 */

/**
 * Format provided phone number
 */
function formatPhone(phone) {
    phone = phone.split(' ').join('');
    phone = phone.split('(').join('');
    phone = phone.split(')').join('');
    phone = phone.split('-').join('');
    if (phone.length === 10) {
        return '001' + phone;
    } else if (phone.startsWith('+1')) {
        return phone.replace('+1', '001');
    } else if (phone.startsWith('001')) {
        return phone;
    } else if (phone.startsWith('+')) {
        return phone.replace('+', '00');
    } else {
        return null;
    }
}

/**
 * Detect the operating system
 */
function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
        return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return "unknown";
}

/**
 * Validates if provided email is valid
 */
function validateEmail(email) {
    return email && /^\S+@\S+\.\S+$/.test(email);
}


/**
 * Initialize the banner form submit button
 */
function initializeStepOneForm(banner) {
    var form = banner.querySelector('.step-one form');
    var os = getMobileOperatingSystem();

    form.onsubmit = function (event) {
        event.preventDefault();

        var email = (form.email.value || '');

        if (validateEmail(email)) {
            stepTwo(banner, os, email);
            return false;
        }
    }
}

/**
 * Ask for phone number, track customer and send to thank you
 */
function stepTwo(banner, os, email) {
    var stepOne = banner.querySelector(".step-one");
    var stepTwo = banner.querySelector(".step-two");
    stepOne.style.display = "none";
    stepTwo.style.display = "flex";

    if (os === "iOS" || os === "Android") {
        var form = stepTwo.querySelector('.mobile-version form');
        form.onsubmit = function (event) {
            event.preventDefault();
            window.open("sms:" + escapeHtml(PARAM_smsRecipient) + ";?&body=(ref: sgnpe) " + escapeHtml(PARAM_smsMessage));

            var eventProperties = getEventProperties('subscribe');
            eventProperties.consent_category = PARAM_consentCategorySMS;
            self.sdk.track('banner', eventProperties);

            identifyCustomerByEmail(email);
            showThankYou(banner);
            return false;
        };
    } else {
        var form = stepTwo.querySelector('.desktop-version form');
        var phoneInput = form.querySelector('input[type="tel"]');
        var onlyCountries = stringToArray(PARAM_onlyCountries);
        var preferredCountries = stringToArray(PARAM_preferredCountries);

        // Initialize intl-tel-input
        var options = {
            initialCountry: PARAM_initialCountry,
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.min.js",
        };

        if (onlyCountries.length > 0) {
            options.onlyCountries = onlyCountries;
        }

        if (preferredCountries.length > 0) {
            options.preferredCountries = preferredCountries;
        }

        banner.phoneInput = window.intlTelInput(phoneInput, options);

        phoneInput.oninput = function () {
            toggleInvalidNumberState(false, phoneInput);
        }

        form.onsubmit = function (event) {
            event.preventDefault();
            toggleInvalidNumberState(false, phoneInput);

            if (!banner.phoneInput.isValidNumber()) {
                toggleInvalidNumberState(true, phoneInput);
                return false;
            }

            // Check if selected country is in onlyCountries
            var onlyCountries = stringToArray(PARAM_onlyCountries);
            var selectedCountry = banner.phoneInput.getSelectedCountryData();
            if (onlyCountries.length > 0 && (!selectedCountry || !selectedCountry.iso2 || !onlyCountries.includes(selectedCountry.iso2))) {
                toggleInvalidNumberState(true, phoneInput);
                return false;
            }

            var phoneNumber = formatPhone(banner.phoneInput.getNumber() || '');

            var eventProperties = getEventProperties('subscribe');
            eventProperties.phone = phoneNumber;
            eventProperties.consent_category = PARAM_consentCategorySMS;
            self.sdk.track('banner', eventProperties);


            identifyCustomerByPhone(phoneNumber);
            identifyCustomerByEmail(email);
            showThankYou(banner);
            return false;
        }
    }
}

function escapeHtml(string) {
    return string
        .replace(/ /g, '%20')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Move to Thank you step after submitting phone number
 */
function showThankYou(banner) {
    var stepTwo = banner.querySelector(".step-two");
    var stepThree = banner.querySelector(".step-three");
    stepTwo.style.display = 'none';
    stepThree.style.display = 'flex';

    setTimeout(function () {
        removeBanner();
    }, 2500);
}

/**
 * Track email attribute, set phone as hard-id and track consent for newsletter
 */
function identifyCustomerByEmail(email) {
    self.sdk.track('consent', {
        // you can add/adjust your own attributes here. Don't forget to change the category attribute.
        'action': "accept",
        'category': PARAM_consentCategoryEmail,
        'valid_until': "unlimited",
        'location': window.location.href,
        'data_source': "Multi-Step Sign-up Unit (Email & SMS)"
    });
    self.sdk.update({
        email: email
    });
    self.sdk.identify({
        email_id: email
    });
}

/**
 * Track phone attribute, set phone as hard-id and track consent for newsletter
 */
function identifyCustomerByPhone(phone) {
    self.sdk.track('double_opt_in', {
        'action': "new",
        'phone': phone,
        'data_source': 'Multi-Step Sign-up Unit (Email & SMS)',
        'consent_list': [{
            action: "accept",
            category: PARAM_consentCategorySMS,
            valid_until: "unlimited"
        }]
    });

    self.sdk.update({
        phone: phone
    });

    self.sdk.identify({
        phone_id: phone
    });
}

/**
 * Method used to dynamically load new stylesheet into the page
 * @param href
 * @returns {Promise<boolean>}
 */
function loadStylesheet(href) {
    return new Promise(function (resolve) {
        var el = document.querySelector(`head > link[rel='${href}']`);
        if (el) {
            return;
        }
        var l = document.createElement('link');
        l.rel = 'stylesheet';
        l.href = href;
        document.body.appendChild(l);
        resolve(true);
    });
}

/**
 * Method used to dynamically load new javascript into the page
 * @param src
 * @returns {Promise<boolean>}
 */
function loadScript(src) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            var el = document.querySelector(`body > script[src='${src}']`);
            if (el) {
                return el['loaded'] ? resolve(true) : attachLoadListener(el);
            }
            var script = document.createElement('script');
            script.src = src;
            script.defer = true;
            script['loaded'] = false;
            attachLoadListener(script);
            document.body.appendChild(script);

            function attachLoadListener(element) {
                element.addEventListener('load', function () {
                    element['loaded'] = true;
                    resolve(true);
                });
            }
        });
    });
}

/**
 * Converts string in format "us, gb" to array ["us", "gb"]
 * @param string
 */
function stringToArray(string) {
    return (string || '').split(',').map(function (item) {
        return item.trim();
    }).filter(function (item) {
        return !!item
    });
}

/**
 * Shows or hides invalid state for phone number input
 */
function toggleInvalidNumberState(invalid, input) {
    if (invalid) {
        input.setCustomValidity(PARAM_invalidNumberMessage);
        input.reportValidity();
    } else {
        input.setCustomValidity('');
        input.reportValidity();
    }
}

/**
 * Register the start trigger and return required removal function
 */

registerStartTrigger();
return {
    remove: removeBanner,
};

})( window.GemQuery || jQuery );
    (function( jQuery ){
  // var $module = jQuery('#m-1678880024795').children('.module');
  // You can add custom Javascript code right here.
})( window.GemQuery || jQuery );
  
    
  