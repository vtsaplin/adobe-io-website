  /**
   * Creates a tag with the given name and attributes.
   * @param {string} name The tag name
   * @param {object} attrs An object containing the attributes
   * @returns The new tag
   */
  function createTag(name, attrs) {
    const el = document.createElement(name);
    if (typeof attrs === "object") {
      for (let [key, value] of Object.entries(attrs)) {
        el.setAttribute(key, value);
      }
    }
    return el;
  }

  function toClassName(name) {
    return name.toLowerCase().replace(/[^0-9a-z]/gi, "-");
  }

  /**
   * Loads a CSS file.
   * @param {string} href The path to the CSS file
   */
  function loadCSS(href) {
    const link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", href);
    document.head.appendChild(link);
  }

  /**
   * Turn tables to DIV.
   * @param {object} $table Table element
   */

  function tableToDivs($table) {
    const $rows = $table.querySelectorAll("tbody tr");
    const blockname = $table.querySelector("th").textContent;
    const $block = createTag("div", { class: `${toClassName(blockname)}` });
    $rows.forEach(($tr) => {
      const $row = createTag("div");
      $tr.querySelectorAll("td").forEach(($td, i) => {
        const $div = createTag("div");
        $div.innerHTML = $td.innerHTML;
        $row.append($div);
      });
      $block.append($row);
    });
    return $block;
  }

  function removeEmptyPTags($theElement){
    $theElement.querySelectorAll('p').forEach(($pElement) => {
      // get rid of empty p tags
      if(!$pElement.hasChildNodes()){
        $pElement.remove();
      }
    })
  }

  function decorateTables() {
    document.querySelectorAll("main div>table").forEach(($table) => {
      const $div = tableToDivs($table);
      $table.parentNode.replaceChild($div, $table);
    });
  }

  function decorateBlocks() {
    document
      .querySelectorAll("main>div.section-wrapper>div>div")
      .forEach(($block) => {
        const classes = Array.from($block.classList.values());
        loadCSS(`/hlx_statics/blocks/${classes[0]}.css`);
        $block
          .closest(".section-wrapper")
          .classList.add(`${classes[0]}-container`);
      });
  }

  function decorateBackgroundImageBlocks() {
    document
      .querySelectorAll("main div.background-image")
      .forEach(($bgImgDiv) => {
        const $images = $bgImgDiv.querySelectorAll("img");
        const $lastImage = $images[$images.length - 1];

        const $section = $bgImgDiv.closest(".section-wrapper");
        if ($section && $lastImage) {
          $section.style.backgroundImage = `url(${$lastImage.src})`;
          let $caption = $lastImage.nextElementSibling;
          if ($caption) {
            if ($caption.textContent == "")
              $caption = $caption.nextElementSibling;
            if ($caption) $caption.classList.add("background-image-caption");
          }
          $lastImage.remove();
        }
      });
  }

  function decorateEmbeds() {
    document.querySelectorAll('a[href]').forEach(($a) => {
      if ($a.textContent.startsWith('https://')) {
        const url=new URL($a.href);
        const usp=new URLSearchParams(url.search);
        let embedHTML='';
        let type='';

        if ($a.href.startsWith('https://www.youtube.com/watch')) {
          const vid=usp.get('v');
          
          type='youtube';
          embedHTML=`<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
            <iframe src="https://www.youtube.com/embed/${vid}?rel=0&amp;v=${vid}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen="" scrolling="no" allow="encrypted-media; accelerometer; gyroscope; picture-in-picture" title="content from youtube" loading="lazy"></iframe>
            </div>
          `;
        }
    
        if (type) {
          const $embed=createTag('div', {class: `embed embed-oembed embed-${type} column-embed`});
          const $div=$a.closest('div');
          $embed.innerHTML=embedHTML;
          $div.parentElement.replaceChild($embed, $div);
        }  
      }
    })

    // helix auto injects youtube vids as a small thumbnail - make sure
    // to take only the embeds not in the column view
    document.querySelectorAll('.embed-youtube > iframe').forEach(($embed) => {
      if(!$embed.parentElement.classList.contains('column-embed')){

        $embed.setAttribute('height', '350px');
        $embed.setAttribute('width', '100%');
      }
    });
  }

  function decorateButtons() {
    document.querySelectorAll("main a").forEach(($a) => {
      const $button = createTag('button');
      $button.addEventListener('click', () => {
        window.location.href = $a.href;
      })
      $button.innerHTML = `<span class="spectrum-Button-label">${$a.innerHTML}</span>`
      const $up = $a.parentElement;
      const $twoup = $a.parentElement.parentElement;
      if ($up.childNodes.length == 1 && $up.tagName == "P") {
        $button.className = 'spectrum-Button spectrum-Button--secondary  spectrum-Button--sizeM';
        $up.replaceChild($button, $a);
      }
      if (
        $up.childNodes.length == 1 &&
        $up.tagName == "STRONG" &&
        $twoup.childNodes.length == 1 &&
        $twoup.tagName == "P"
      ) {
        $button.className = 'spectrum-Button spectrum-Button--cta  spectrum-Button--sizeM';
        $twoup.replaceChild($button, $up);
      }
    });


    // const $consoleButton = document.querySelector("header p:last-child a");
    // $consoleButton.className = "button secondary";
  }

  function decorateIframe() {
    document.querySelectorAll(".iframe a").forEach(($a) => {
      if ($a.textContent.startsWith("https://")) {
        const url = new URL($a.href);

        let embedHTML = `<div>
      <iframe src="${$a.href}" style="border: 0; width: 100%; height: 100%; position: absolute;"></iframe>
      </div>
      `;

        let type = "iframe";

        if (type) {
          const $embed = createTag("div", {
            class: `embed embed-oembed embed-${type}`,
          });
          const $div = $a.closest("div");
          $embed.innerHTML = embedHTML;
          $div.parentElement.replaceChild($embed, $div);
        }
      }
    });
  }

  function wrapSections(element) {
    document.querySelectorAll(element).forEach(($div) => {
      const $wrapper = createTag("div", { class: "section-wrapper" });
      $div.parentNode.appendChild($wrapper);
      $wrapper.appendChild($div);
    });
  }

  function decorateHero() {
    document.querySelectorAll('.hero-container').forEach(($heroSection) => {
      removeEmptyPTags($heroSection);

      $heroSection.querySelectorAll('.hero').forEach(($hero) => {
        $hero.classList.add('spectrum--lightest')
      });

      $heroSection.querySelectorAll('img.icon').forEach(($heroIcon) => {
        $heroIcon.parentElement.classList.add('icon-container');
      })

      $heroSection.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(($header) => {
        $header.classList.add('spectrum-Heading', 'spectrum-Heading--sizeXXL', 'spectrum-Heading--serif');
      })

      $heroSection.querySelectorAll('p').forEach(($p) => {
        const $hasLinks = $p.querySelectorAll('a, button');
        // don't attach to icon container or if p tag contains links
        if(!$p.classList.contains('icon-container') && $hasLinks.length === 0) {
          $p.classList.add('spectrum-Body', 'spectrum-Body--sizeL');
        }
      });

      // put buttons into their own div
      const $buttonContainer = createTag('div', {class: 'hero-button-container'});
      $heroSection.querySelectorAll('button').forEach(($button) => {
        $button.classList.add('spectrum-Button--quiet')
        $buttonContainer.append($button);
      });

      // have to remove ps after moving buttons
      removeEmptyPTags($heroSection);

      const $firstSection = $heroSection.querySelector('div.hero>div>div');
      $firstSection.append($buttonContainer);
    });
  }

  function decorateTitle($container, $containerClass) {
    // search container for h's and p's not inside a container and apply title block classes
    $container.querySelectorAll('p').forEach(($pTag) => {
      const $mainContainer = $container.querySelector('div.'+ $containerClass);
      if(!$mainContainer.contains($pTag)) {
        $pTag.classList.add('title-body', 'spectrum-Body--sizeL', 'spectrum-Body--light');
      }
    })

    $container.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(($hTag) => {
      const $mainContainer = $container.querySelector('div.'+ $containerClass);
      if(!$mainContainer.contains($hTag)) {
        $hTag.classList.add('title-header', 'spectrum-Heading--sizeL', 'spectrum-Heading--light');
      }
    })
  }

  function readBlockConfig($block) {
    const config = {};
    $block.querySelectorAll(":scope>div").forEach(($row) => {
      if ($row.children && $row.children[1]) {
        const name = toClassName($row.children[0].textContent);
        const $a = $row.children[1].querySelector("a");
        let value = "";
        if ($a) value = $a.href;
        else value = $row.children[1].textContent;
        config[name] = value;
      }
    });
    return config;
  }

  function displayFilteredCards(catalog, $cards, buttons, limit, filters) {
    $cards.innerHTML = "";
    let counter = 0;
    catalog.forEach((card) => {
      let show = true;
      if (filters && filters[0]) {
        if (!filters.includes(card.Category)) show = false;
      }

      if (counter >= limit) show = false;
      if (show) {

        let iconTemplate = '';
        if(card.Icon) {
          iconTemplate = `
            <div class="api-card-icon-container">
              <img
                class="api-card-icon"
                src="/hlx_statics/icons/${card.Icon}.svg"
              />
            </div>
          `
        }

        let buttonTemplate = '';
        buttons.forEach((b, i) => {
          if (card[b]) {
            if(i === 0){
              buttonTemplate += 
                `<button onClick="location.href=${card[b]}" class="spectrum-Button spectrum-Button--secondary spectrum-Button--quiet spectrum-Button--sizeM">
                  <span class="spectrum-Button-label">${b}</span>
                </button>`
            
            } else {
              buttonTemplate +=
              `
              <button onClick="location.href=${card[b]}" class="spectrum-Button spectrum-Button--primary spectrum-Button--sizeM">
                <span class="spectrum-Button-label">${b}</span>
              </button>
              `
            
            }
          }
        });

        let cardTemplate = `
<div class="api-card spectrum--lightest">
  <div
    class="spectrum-Card api-card-inner"
    role="figure"
    tabindex="0"
    dir="ltr"
  >
    <div class="spectrum-Card-body api-card-body">
      ${iconTemplate}
      <div class="api-card-body-inner">
        <div
          class="api-card-title-container spectrum-Card-header spectrum-Heading spectrum-Heading--sizeXXS"
        >
          <div class="api-card-title spectrum-Card-title">
            <strong><h4>${card.Title}</h4></strong>
          </div>
        </div>
        <div
          class="spectrum-Card-content spectrum-Body spectrum-Body--sizeS api-card-content"
        >
          ${card.Description}
        </div>
      </div>
    </div>
    <div class="spectrum-Card-footer">
        <div class="api-card-button-container">
          ${buttonTemplate}
        </div>
    </div>
  </div>
</div>
`;


        $cards.innerHTML += cardTemplate;
        counter++;
      }
    });
  }

  function decorateHeader() {
    let $header = document.querySelector('header');

    let $pContainer = document.createElement('p');
    let $pContent = document.createTextNode('Adobe I/O');
    let $imgContainer = document.createElement('img');

    $imgContainer.classList.add('icon', 'icon-adobe');
    $imgContainer.src = '/hlx_statics/icons/adobe.svg';
    $imgContainer.alt = 'adobe icon';

    $pContainer.appendChild($imgContainer);
    $pContainer.appendChild($pContent);

    let $ulContainer = document.createElement('ul');

    document.querySelectorAll(".nav a").forEach(($item) => {
      let $liContainer = document.createElement('li');
      $liContainer.appendChild($item);
      $ulContainer.appendChild($liContainer);
    });

    $header.appendChild($pContainer);
    $header.appendChild($ulContainer);

    let $aLink = document.createElement('a');
    $aLink.href = 'https://console.adobe.io/';
    $aLink.textContent = 'Console';

    let $strong = document.createElement('strong');
    $strong.appendChild($aLink);

    $pContainer = document.createElement('p');
    $pContainer.appendChild($strong);

    $header.appendChild($pContainer);
    
    const $navContainer = document.querySelector('.nav');
    $navContainer.remove();
  }

  function decorateAnnouncement() {
    document.querySelectorAll(".announcement").forEach(($announcement) => {
      removeEmptyPTags($announcement);
      $announcement.querySelectorAll('br').forEach(($br) => {
        $br.remove();
      });
      $announcement.querySelectorAll('p a').forEach(($link) => {
        $link.parentElement.classList.add('announce-link');
      });
    });
  }

  function decorateAPIBrowser() {
    document.querySelectorAll('.api-browser-container').forEach(($apiBrowserContainer) => {
      decorateTitle($apiBrowserContainer, 'api-browser');
    });

    document.querySelectorAll(".api-browser").forEach(async ($apiBrowser) => {
      const config = readBlockConfig($apiBrowser);
      window.aio = window.aio || {};
      const resp = await fetch("/api-catalog.json");
      window.aio.apiCatalog = (await resp.json()).data;
      const catalog = window.aio.apiCatalog;
      let buttons = ["Learn More", "View Docs"];

      if (config.display)
        buttons = config.display.split(",").map((e) => e.trim());

      $apiBrowser.innerHTML = "";
      if (config.filters == "Show") {
        const categories = catalog
          .map((e) => e.Category)
          .filter((v, i, self) => {
            return self.indexOf(v) === i;
          });

        const $cards = createTag("div", { class: "api-cards" });
        const $filters = createTag("div", { class: "filters" });
        $filters.innerHTML = `<strong>Filter by</strong>`;
        
        categories.forEach((c) => {
          const $filter = createTag("div");
          const id = toClassName(c);
          $filter.innerHTML = `<input type="checkbox" id="${id}" name="${id}" value="${c}">
        <label for="${id}"> ${c}</label><br>`;
          $filter.addEventListener("click", (evt) => {
            const filters = [];
            $filters
              .querySelectorAll(`:checked`)
              .forEach(($cb) => filters.push($cb.value));
            displayFilteredCards(catalog, $cards, buttons, config.limit, filters);
          });
          $filters.append($filter);
        });
        $apiBrowser.append($filters);

        $apiBrowser.append($cards);
        displayFilteredCards(catalog, $cards, buttons, config.limit);
      }
    });
  }

  function decorateCards() {
    document.querySelectorAll('.cards').forEach(($card) => {
      removeEmptyPTags($card);
    });
  }

  function decorateColumns() {
    document.querySelectorAll('.columns').forEach(($column) => {
      removeEmptyPTags($column);

      $column.querySelectorAll('img + a').forEach(($productLink) => {
        // this is annoying - sometimes it's wrapper is in p and sometimes not?
        // is it when gdoc has two icons in a row that p will be used?
        if($productLink.parentElement.tagName === 'P') {
          $productLink.parentElement.classList.add('product-link');
        } else {
          let $pContainer = createTag('p', { class: 'product-link'});

          let $newImg = $productLink.previousSibling.previousSibling.cloneNode(true);
          let $newP = $productLink.cloneNode(true);

          $pContainer.append($newImg);
          $pContainer.append($newP);
          $productLink.previousSibling.previousSibling.remove();
          $productLink.parentNode.replaceChild($pContainer, $productLink);
        }
      });

      $column.childNodes.forEach(($row) => {
        if($row.childNodes.length > 1) {
          let $textColumnContainer = createTag('div', { class : 'columns-text'});

          // find the text column in the row and wrap it then insert it 
          let $cloneNodes;
          if($row.childNodes[0].textContent.length > 0) {
            $cloneNodes = $row.childNodes[0].cloneNode(true);
            $textColumnContainer.append($cloneNodes); 
            $row.replaceChild($textColumnContainer, $row.childNodes[0]);
          } else if($row.childNodes[1].textContent.length > 0) {
            $cloneNodes = $row.childNodes[1].cloneNode(true);
            $textColumnContainer.append($cloneNodes); 
            $row.replaceChild($textColumnContainer, $row.childNodes[1]);
          }
        } 
      });
    });

    document.querySelectorAll('.columns-dark').forEach(($column) => {
      removeEmptyPTags($column);

      // re-wrap second container so it's easier to vertically align
      $column.childNodes.forEach(($row) => {
        if($row.childNodes.length > 1) {
          let $textColumnContainer = createTag('div', { class : 'columns-text'});

          // find the text column in the row and wrap it then insert it 
          // may have to expand search to allow all media types instead of just iframe
          let $cloneNodes;
          if(!$row.childNodes[0].querySelector('iframe')) {
            $cloneNodes = $row.childNodes[0].cloneNode(true);
            $textColumnContainer.append($cloneNodes); 
            $row.replaceChild($textColumnContainer, $row.childNodes[0]);

          } else if(!$row.childNodes[1].querySelector('iframe')) {
            $cloneNodes = $row.childNodes[1].cloneNode(true);
            $textColumnContainer.append($cloneNodes); 
            $row.replaceChild($textColumnContainer, $row.childNodes[1]);
          }
        } 
      });
    });
  }

  function decorateResourceCards() {
    document.querySelectorAll('.section-wrapper').forEach(($section) => {
      $section.querySelectorAll('.resource-card-large').forEach(($resourceLarge) => {

        // find the image
        let $image = $resourceLarge.querySelector('img');
        if($image) {
          let $imageContainer = $image.parentElement;
    
          $imageContainer.style.backgroundImage = 'url('+ $image.src + ')';
          $imageContainer.classList.add('resource-card-large-image-container');
    
          $image.remove();
        }
    
        let $link = $resourceLarge.querySelector('a');
        if($link) {
          $resourceLarge.addEventListener('click', url => {
            window.open($link.href, '_blank');
          });
          $link.remove();
        }
    
        let $resourceLargeContainer = createTag('div', { class: 'resource-card-large-container-inner'});
        let $resourceLargeContainerParent = $resourceLarge.parentElement;
    
        $resourceLargeContainer.append($resourceLarge);
        $resourceLargeContainerParent.append($resourceLargeContainer);
        removeEmptyPTags($resourceLarge);
      });
    
      // take two small resource cards and wrap em
      let $containerParent = $section.querySelector('.resource-card-small-container > div');
      let $resourceSmallContainer = createTag('div', { class: 'resource-card-small-container-inner'});

      let $resourceSmallContainerSecond = createTag('div', { class: 'resource-card-small-container-inner'});
      $section.querySelectorAll('.resource-card-small').forEach(($resourceSmall, index) => {
        // find the image
        let $image = $resourceSmall.querySelector('img');
        if($image) {
          let $imageContainer = $image.parentElement;
    
          $imageContainer.style.backgroundImage = 'url('+ $image.src + ')';
          $imageContainer.classList.add('resource-card-small-image-container');
    
          $image.remove();
        }
    
        let $link = $resourceSmall.querySelector('a');
        if($link) {
          $resourceSmall.addEventListener('click', url => {
            window.open($link.href, '_blank');
          });
          $link.remove();
        }

        // annoying logic to wrap two small cards vs four
        if(index <= 1) {
          $resourceSmallContainer.append($resourceSmall);
        } else {
          $resourceSmallContainerSecond.append($resourceSmall);
          $containerParent.append($resourceSmallContainerSecond);
        }
        removeEmptyPTags($resourceSmall);
      });
    
      if($containerParent) {
        $containerParent.append($resourceSmallContainer);
      }
    
      let $resourceFlexContainer = createTag('div', {class: 'resource-card-flex-container'});
      $section.querySelectorAll('.resource-card-large-container-inner').forEach(($largeSection) => {
        $resourceFlexContainer.append($largeSection);
      });

      $section.querySelectorAll('.resource-card-small-container-inner').forEach(($smallSection) => {
        $resourceFlexContainer.append($smallSection);
      });
      $section.append($resourceFlexContainer);
    });
  
  }

  function decorateSummary() {
    document.querySelectorAll(".summary-container").forEach(($summary) => {
      $backgroundImg = $summary.querySelector('img');
      $summary.style.backgroundImage = 'url('+ $backgroundImg.src + ')';
      $backgroundImg.remove();
      removeEmptyPTags($summary);

      // fix up button styling
      let $linkContainer = createTag('div', {class: 'summary-link-container'});
      const $primaryLink = $summary.querySelector('p > strong');
      if($primaryLink) {
        $primaryLink.parentElement.classList.add('summaryPrimaryLink');
        $linkContainer.append($primaryLink.parentElement);
      }

      const $secondaryLink = $summary.querySelector('p > a');
      if($secondaryLink) {
        $secondaryLink.parentElement.classList.add('summarySecondaryLink');
        $linkContainer.append($secondaryLink.parentElement);
      }

      let $textContainer = $summary.querySelector('.summary > div > div')
      $textContainer.append($linkContainer);
    });
  }

  function fixIcons() {
    document.querySelectorAll('img.icon').forEach(($icon) => {
      // fix up paths for icons that are injected into the doc when using :icon: 
      if($icon.getAttribute('src').indexOf('hlx_statics') === -1){
        $icon.setAttribute('src',  '/hlx_statics' + $icon.getAttribute('src') );
      }
    });
  }


  function later() {
    document.documentElement.classList.add('spectrum','spectrum--light','spectrum--medium');
    loadCSS('/hlx_statics/spectrum/vars/dist/spectrum-global.css');
    loadCSS('/hlx_statics/spectrum/vars/dist/spectrum-medium.css');
    loadCSS('/hlx_statics/spectrum/vars/dist/spectrum-light.css');
    loadCSS('/hlx_statics/spectrum/vars/dist/spectrum-lightest.css');
    loadCSS('/hlx_statics/spectrum/page/dist/index-vars.css');
    loadCSS('/hlx_statics/spectrum/button/dist/index-vars.css');
    loadCSS('/hlx_statics/spectrum/typography/dist/index-vars.css');
    loadCSS('/hlx_statics/spectrum/card/dist/index-vars.css');
  }

  async function decoratePage() {
    decorateTables();
    wrapSections("main>div");
    decorateBlocks();
    wrapSections("header>div, footer>div");
    decorateButtons();
    //decorateHeader();
    decorateHero();
    // decorateEmbeds();

    // decorateCards();
    // decorateColumns();
    // decorateAnnouncement();
    decorateAPIBrowser()
    // decorateResourceCards();
    // decorateSummary();
    // fixIcons();
    later();
  }

  decoratePage();
