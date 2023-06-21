

    
  /**
 * Universal parameters
 */
var PARAM_showAfter = parseInt("[[ {name: 'showAfter', tooltip: 'Time in milliseconds', category: 'Triggering', orderIndex: '12000', isJsonParam: true} : number | 0 ]]", 10);
var PARAM_removeAfter = parseInt("[[ {name: 'removeAfter', tooltip: 'Time in milliseconds', category: 'Triggering', orderIndex: '12001', isJsonParam: true} : number | 0 ]]", 10);
var PARAM_trigger = "[[ {name: 'trigger', tooltip: '', category: 'Triggering', orderIndex: '12002', isJsonParam: true} : enum(On entry,On exit,On scroll) | On entry ]]";
var PARAM_parentElement = "[[ {name: 'parentElement', tooltip: 'CSS selector of an element to which the banner will be added', category: 'Position', orderIndex: '15000', isJsonParam: true} : string | body ]]";
var PARAM_positionVertical = "[[ {name: 'positionVertical', tooltip: '', category: 'Position', orderIndex: '15001', isJsonParam: true} : enum(Top,Center,Bottom) | Bottom ]]";
var PARAM_positionHorizontal = "[[ {name: 'positionHorizontal', tooltip: '', category: 'Position', orderIndex: '15002', isJsonParam: true} : enum(Left,Center,Right) | Right ]]";
var PARAM_enterAnimation = "[[ {name: 'enterAnimation', tooltip: '', category: 'Position', orderIndex: '15003', isJsonParam: true} : enum(None,Fade in,Slide in) | None ]]";

/**
 * Template specific parameters
 */

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
    PARAM_parentElement = 'body';

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

    setTimeout(function() {
        // Track show event after timer expired
        trackEvent('show', false);

        // Create and display the banner
        requestAnimationFrame(createBanner);

        // If removeAfter is provided start the removal timer
        if (PARAM_removeAfter > 0) {
            setTimeout(function() {
                removeBanner();
            }, PARAM_removeAfter);
        }
    }, PARAM_showAfter);
}

/**
 * Function used to insert the banner contents into the HTML and adding basic functionality
 */
function createBanner() {
    // select the parent element
    var parentElement = document.querySelector(PARAM_parentElement);

    // insert banner HTML into the website
    parentElement.insertAdjacentHTML('afterbegin', self.html);

    // get the banner reference
    self.banner = parentElement.firstElementChild;

    // add close functionality to the close button
    self.banner.querySelector('.close').onclick = handleCloseButtonClick;

    // add classes specifying banner position and animation
    self.banner.className += ' ' + getPositionAndAnimationClasses();

    // insert banner CSS into the website
    self.banner.insertAdjacentHTML('afterbegin', '<style>' + self.style + '</style>');

    // track clicking on <a> in the banner
    var links = self.banner.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
        trackLink(links[i], 'click', true);
    }

    initializeForm(self.banner);
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
  * Validates if provided email is valid
  */
 function validateEmail(email) {
    return email && /^\S+@\S+\.\S+$/.test(email);
}

/**
 * Initialize the banner form submit button
 */
function initializeForm(banner) {
	var form = banner.querySelector('form');
    form.onsubmit = function (event) {
    	event.preventDefault();
        var eventProperties = getEventProperties('subscribe');
        var email = (form.email.value || '').toLowerCase();
        if (!validateEmail(email)) {
        	return false;
        }

        eventProperties.email = email;
        eventProperties.email_id = email;
        eventProperties.relationship = form.relationship.value || '';
        eventProperties.first_name = form.firstName.value || '';
        eventProperties.last_name = form.lastName.value || '';
        eventProperties.date_of_birth = form.parentbirthdate.value ? new Date(form.parentbirthdate.value).getTime() / 1000 : undefined;
        eventProperties.birth_or_due_date_1 = form.birthDate.value ? new Date(form.birthDate.value).getTime() / 1000 : undefined;
        exponea.update ({ 
        	email: email, 
        	first_name: form.firstName.value, 
        	last_name: form.lastName.value,
        	date_of_birth: form.parentbirthdate.value ? new Date(form.parentbirthdate.value).getTime() / 1000 : undefined,
        	birth_or_due_date_1: form.birthDate.value ? new Date(form.birthDate.value).getTime() / 1000 : undefined,
        	relationship: form.relationship.value,
        	country:"United Kingdom",
        	language:"en-gb",
        });
        exponea.track('consent', {
		action: 'accept',
		valid_until: 'unlimited',
		category: 'email',
		source: 'newsletter-form',
		data_source: 'newsletter-form',
		});
		exponea.identify({ 
        email_id: email 
    });
        self.sdk.track('banner', eventProperties);
        showThankYou(banner)
        return false;
    };
}

/**
 * Move to Thank you step after submitting the form
 */
function showThankYou(banner) {
	var stepOne = banner.querySelector('.step-one');
	var stepTwo = banner.querySelector('.step-two');
	stepOne.style.display = 'none';
	stepTwo.style.display = 'block';

	setTimeout(function() {
		removeBanner();
	}, 10000);
}

/**
 * Register the start trigger and return required removal function
 */

registerStartTrigger();
return {
    remove: removeBanner,
};

    
  