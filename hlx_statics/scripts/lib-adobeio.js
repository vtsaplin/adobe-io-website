import {
  buildBlock,
} from './lib-helix.js';

/**
 * Breakpoints
 */
export const MOBILE_SCREEN_WIDTH = 700;
export const LARGE_SCREEN_WIDTH = 1280;

/**
 * Checks if an a tag href points to an external link.
 * Updates the tag target and rel attributes accordingly.
 * @param {*} a The a tag to check
 */
export function checkExternalLink(a) {
  const url = a.href;
  if (url.indexOf('developer.adobe.com') === -1
    && url.indexOf('hlx.page') === -1
    && url.indexOf('hlx.live') === -1) {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }
}

/**
 * Returns the container div of a block
 * @param {*} block The block to retrieve the container div from
 * @returns The container div of the block, null otherwise
 */
export function getBlockSectionContainer(block) {
  return (block && block.parentElement && block.parentElement.parentElement)
    ? block.parentElement.parentElement
    : null;
}

/**
 * Creates a tag with the given name and attributes.
 * @param {string} name The tag name
 * @param {object} attrs An object containing the attributes
 * @returns The new tag
 */
export function createTag(name, attrs) {
  const el = document.createElement(name);
  if (typeof attrs === 'object') {
    Object.entries(attrs).forEach(([key, value]) => {
      el.setAttribute(key, value);
    });
  }
  return el;
}

/**
 * Sets-up event listeners to handle focus and blur for the elements of a DOM object
 * @param {*} domObj The DOM object to inspect, the whole document by default
 */
export function focusRing(domObj = document) {
  domObj.querySelectorAll('a.spectrum-Link').forEach((a) => {
    a.addEventListener('focus', () => {
      a.classList.add('focus-ring');
    });

    a.addEventListener('blur', () => {
      a.classList.remove('focus-ring');
    });
  });

  domObj.querySelectorAll('a.spectrum-Button').forEach((button) => {
    button.addEventListener('focus', () => {
      button.classList.add('focus-ring');
    });

    button.addEventListener('blur', () => {
      button.classList.remove('focus-ring');
    });
  });

  domObj.querySelectorAll('div.spectrum-Card').forEach((card) => {
    card.addEventListener('focus', () => {
      card.classList.add('focus-ring');
    });

    card.addEventListener('blur', () => {
      card.classList.remove('focus-ring');
    });
  });

  domObj.querySelectorAll('a.spectrum-Card').forEach((card) => {
    card.addEventListener('focus', () => {
      card.classList.add('focus-ring');
    });

    card.addEventListener('blur', () => {
      card.classList.remove('focus-ring');
    });
  });

  domObj.querySelectorAll('input.spectrum-Checkbox-input').forEach((input) => {
    input.addEventListener('focus', () => {
      input.classList.add('focus-ring');
    });

    input.addEventListener('blur', () => {
      input.classList.remove('focus-ring');
    });
  });

  domObj.querySelectorAll('button.spectrum-Picker').forEach((button) => {
    button.addEventListener('focus', () => {
      button.classList.add('focus-ring');
    });

    button.addEventListener('blur', () => {
      button.classList.remove('focus-ring');
    });
  });

  domObj.querySelectorAll('div.nav-sign-in button').forEach((button) => {
    button.addEventListener('focus', () => {
      button.classList.add('focus-ring');
    });

    button.addEventListener('blur', () => {
      button.classList.remove('focus-ring');
    });
  });
}

/**
 * Removes empty children p tags of a given element
 * @param {*} element The element to inspect
 */
export function removeEmptyPTags(element) {
  element.querySelectorAll('p').forEach((p) => {
    // get rid of empty p tags
    if (!p.hasChildNodes()) {
      p.remove();
    }
  });
}

/**
 * Decorates the a tags of a block as Spectrum Buttons
 * @param {*} block The block to inspect
 */
export function decorateButtons(block) {
  block.querySelectorAll('a').forEach((a) => {
    a.innerHTML = `<span class="spectrum-Button-label">${a.innerHTML}</span>`;
    const up = a.parentElement;
    const twoup = a.parentElement.parentElement;
    a.tabindex = 0;
    if (up.childNodes.length === 1 && up.tagName === 'P') {
      a.className = 'spectrum-Button spectrum-Button--fill spectrum-Button--secondary  spectrum-Button--sizeM';
    }

    checkExternalLink(a);

    if (
      up.childNodes.length === 1
      && up.tagName === 'STRONG'
      && twoup.childNodes.length === 1
      && twoup.tagName === 'P'
    ) {
      a.className = 'spectrum-Button spectrum-Button--fill spectrum-Button--cta  spectrum-Button--sizeM';
      twoup.replaceChild(a, up);
    }
  });
}

/**
 * Builds all embed blocks inside a container
 * @param {*} container The container to inspect
 */
export function buildEmbeds(container) {
  const embeds = [...container.querySelectorAll('div > p > a[href^="https://www.youtube.com"], div > p > a[href^="https://youtu.be"]')];
  embeds.forEach((embed) => {
    const block = buildBlock('embed', embed.outerHTML);
    embed.replaceWith(block);
    block.classList.add('block');
    const parentContainer = block.parentElement.parentElement;
    parentContainer.prepend(block);
    removeEmptyPTags(parentContainer);
  });
}

/**
 * Toggles the scale according to the client width
 */
export function toggleScale() {
  const doc = document.documentElement;
  const isLargeScale = doc.clientWidth < MOBILE_SCREEN_WIDTH;
  doc.classList.toggle('spectrum--medium', !isLargeScale);
  doc.classList.toggle('spectrum--large', isLargeScale);
}

/**
 * Rearranges the hero picture of a block to be properly optimized and overlaid by text
 * @param {*} block The block containing the picture to rearrange
 */
export function rearrangeHeroPicture(block, overlayStyle) {
  const picture = block.querySelector('picture');
  const emptyDiv = picture.parentElement.parentElement;
  block.prepend(picture);
  picture.setAttribute('style', 'position: relative; max-width: 100%; display: flex; align-items: center; justify-content: center;');
  const div = block.querySelector('div');
  div.setAttribute('style', overlayStyle);
  const img = picture.querySelector('img');
  img.setAttribute('style', 'width: 100% !important; max-height: 350px');
  emptyDiv.remove();
}

/**
 * Generates the HTML code for the active tab
 * @param {*} width The width of the tab
 * @param {*} isMainPage Defines whether the current page is main page or not
 * @returns The HTML code for the active tab
 */
function activeTabTemplate(width, isMainPage = false) {
  const calcWidth = parseInt(width, 10) - 24;
  return `<div class="nav-link-active" style="width: ${calcWidth}px; transform:translate(12px,0); bottom: ${!isMainPage ? '0.5px' : '-1px'}"></div>`;
}

/**
 * Sets the current tab as active
 * @param {*} isMainPage Defines whether the current page is main page or not
 */
export function setActiveTab(isMainPage) {
  const nav = document.querySelector('#navigation-links');
  let currentPath = window.location.pathname;

  nav.querySelectorAll('li > a').forEach((tabItem) => {
    const hrefPath = new URL(tabItem.href);

    if (hrefPath && hrefPath.pathname) {
      // remove trailing slashes before we compare
      const hrefPathname = hrefPath.pathname.replace(/\/$/, '');
      currentPath = currentPath.replace(/\/$/, '');
      if (currentPath === hrefPathname) {
        const parentWidth = tabItem.parentElement.offsetWidth;
        tabItem.parentElement.innerHTML += activeTabTemplate(parentWidth, isMainPage);
      }
    }
  });
}

/**
 * Checks whether the current URL is one of the top level navigation items
 * @param {*} urlPathname The current URL path name
 * @returns True if the current URL is one of the top level navigation items, false otherwise
 */
export function isTopLevelNav(urlPathname) {
  return urlPathname.indexOf('/apis') === 0
    || urlPathname.indexOf('/open') === 0
    || urlPathname.indexOf('/developer-support') === 0;
}

/**
 * Checks whether the current URL is a dev environment based on host value
 * @param {*} host The host
 * @returns True if the current URL is a dev environment, false otherwise
 */
export function isDevEnvironment(host) {
  return host.indexOf('localhost') >= 0;
}

/**
 * Checks whether the current URL is a stage environment based on host value
 * @param {*} host The host
 * @returns True if the current URL is a stage environment, false otherwise
 */
export function isStageEnvironment(host) {
  return host.indexOf('stage.adobe.io') >= 0
    || host.indexOf('developer-stage') >= 0;
}

/**
 * Checks whether the current URL is a Franklin website based on host value
 * @param {*} host The host
 * @returns True if the current URl is a Franklin website, false otherwise
 */
export function isHlxPath(host) {
  return host.indexOf('hlx.page') >= 0
    || host.indexOf('hlx.live') >= 0
    || host.indexOf('localhost') >= 0;
}

/**
 * Returns expected origin based on the host
 * @param {*} host The host
 * @param {*} suffix A suffix to append
 * @returns The expected origin
 */
export const setExpectedOrigin = (host, suffix = '') => {
  if (isDevEnvironment(host)) {
    return `http://localhost:3000${suffix}`;
  }
  if (isStageEnvironment(host)) {
    return `https://developer-stage.adobe.com${suffix}`;
  }
  if( isHlxPath(host)) {
    return `${window.location.origin}${suffix}`;
  }
  return `https://developer.adobe.com${suffix}`;
};

/**
 * Returns the first level sub folder
 * @param {*} host The host
 * @param {*} path The pathname
 * @param {*} suffix A suffix to append
 * @returns The first level subfolder in the franklin dir - defaults to franklin_assets in root
 */
 export const getFranklinFirstSubFolder = (host, suffix = '') => {
  let subfolderPath = location.pathname.split('/')[1];

  // make sure top level paths point to the same nav
  if(subfolderPath === '' || subfolderPath === 'apis' || subfolderPath === 'open' || subfolderPath === 'developer-support') {
    subfolderPath = 'franklin_assets'
  }

  if (isDevEnvironment(host)) {
    return `http://localhost:3000/${subfolderPath}/${suffix}`;
  }
  if (isStageEnvironment(host)) {
    return `https://developer-stage.adobe.com/${subfolderPath}/${suffix}`;
  }
  if( isHlxPath(host)) {
    return `${window.location.origin}/${subfolderPath}/${suffix}`;
  }
  return `https://developer.adobe.com/${subfolderPath}/${suffix}`;
};

/**
 * Sets given query parameter to provided value and updates URL
 * @param {*} name The query parameter name
 * @param {*} value The value of the query parameter
 * @returns URLSearchParams object state
 */
export const setQueryStringParameter = (name, value) => {
  const params = new URLSearchParams(window.location.search);
  params.set(name, value);
  window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
  return params;
};

/**
 * 
 * @returns 
 */
export const getQueryString = () => {
  const params = new URLSearchParams(window.location.search);
  console.log(params.toString());
  return params.toString();
}

/**
 * Returns the HTML code for the global navigation user profile
 * @param {*} profile The user profile
 * @returns The global navigation user profile for the current user
 */
function globalNavProfileTemplate(profile) {
  return `
    <div class="nav-profile spectrum--lightest">
      <button id="nav-profile-dropdown-button" class="spectrum-ActionButton spectrum-ActionButton--sizeM spectrum-ActionButton--quiet  navigation-dropdown">
        <svg class="spectrum-Icon spectrum-Icon--sizeM" focusable="false" aria-hidden="true" aria-label="Profile">
          <use xlink:href="#spectrum-icon-24-RealTimeCustomerProfile"></use>
        </svg>
      </button>
        <div id="nav-profile-dropdown-popover" class="spectrum-Popover spectrum-Popover--bottom spectrum-Picker-popover spectrum-Picker-popover--quiet">
          <div class="nav-profile-popover-innerContainer">
            <div class="nav-profile-popover-avatar">
              <img alt="Avatar" id="nav-profile-popover-avatar-img" src=${profile.avatarUrl} alt="Profile icon" />
            </div>
            <div class="nav-profile-popover-name">
              <h1 id="nav-profile-popover-name" class="spectrum-Heading spectrum-Heading--sizeM">
                ${profile.name}
              </h1>
            </div>
            <div class="nav-profile-popover-divider">
              <hr />
            </div>
            <a href="https://account.adobe.com/" class="spectrum-Button spectrum-Button--primary spectrum-Button--quiet spectrum-Button--sizeM nav-profile-popover-edit">
              Edit Profile
            </a>
            <a href="#" id="signOut" class="spectrum-Button spectrum-Button--secondary spectrum-Button--sizeM nav-profile-popover-sign-out">
              Sign out
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Decorates the profile section based on the current user profile
 * @param {*} profile The current user profile
 */
export function decorateProfile(profile) {
  // replace sign-in link with profile
  const signIn = document.querySelector('div.nav-sign-in');
  const parentContainer = signIn.parentElement;
  signIn.remove();
  parentContainer.insertAdjacentHTML('beforeend', globalNavProfileTemplate(profile));

  const profileDropdownPopover = parentContainer.querySelector('div#nav-profile-dropdown-popover');
  const button = parentContainer.querySelector('button#nav-profile-dropdown-button');

  button.addEventListener('click', (evt) => {
    if (!evt.currentTarget.classList.contains('is-open')) {
      button.classList.add('is-open');
      profileDropdownPopover.classList.add('is-open');
      profileDropdownPopover.ariaHidden = false;
    } else {
      button.classList.remove('is-open');
      profileDropdownPopover.classList.remove('is-open');
      profileDropdownPopover.ariaHidden = false;
    }
  });

  const signOut = parentContainer.querySelector('#signOut');
  signOut.addEventListener('click', (evt) => {
    evt.preventDefault();
    window.adobeIMSMethods.signOut();
  });
}

/**
 * Adds an extra script tag to the document
 * @param {*} element The element to which the script will be added
 * @param {*} scriptUrl The URL to the script to add
 */
export function addExtraScript(element, scriptUrl) {
  const script = createTag('script', { type: 'text/javascript' });
  script.src = scriptUrl;
  element.appendChild(script);
}
