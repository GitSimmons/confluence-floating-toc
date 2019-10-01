document.addEventListener(
  "DOMContentLoaded",
  function() {
    /* Add the On This Page text to the top of the ToC */
    const titleText = "On this page";
    let toc = document.getElementsByClassName("ts-toc-btf");
    let onThisPage = document.createElement("p");
    const text = document.createTextNode(titleText);
    onThisPage.appendChild(text);
    toc[0].insertBefore(onThisPage, toc[0].firstChild);
    /* Get all the Headers, make sure to remove any that aren't included in your ToC */
    const sections = document.querySelectorAll(
      ".innerCell > h1, .innerCell > h2, .innerCell > h3, .innerCell > h4, .innerCell > h5, .innerCell > h6"
    );
    /* Get all ToC Links */
    const nav_links = document.querySelectorAll(".ts-toc-btf a");
    /* Get the text for the toc links and trim whitespace from beginning of links */
    nav_links.forEach(link => (link.textContent = link.textContent.trim()));

    /* This is the index of the currently active link in the ToC. Because of the way it works, it'll default to Sections.length when
    no heading is active  */
    let currentActive = sections.length;
    /* Here are the functions that do all the work
    Might be worth knowing that a Confluence ToC looks like
    <ul>
    <li>
      <span class="toc-item-body">
        <span lass="toc-outline" />
        <a href="#id" class="toc-link"> Title </a>
      </span>
       <ul>
         <li>
           <span class="toc-item-body">
              <span class="toc-outline" />
              <a href="#id2" class="toc-link"> Nested Title 2 </a>
            </span>
          </li>
        </ul>
    </li>
    </ul>
    */
    const highlightTopLevelHeadingsOfActiveHeading = () => {
      /* TODO: (low priority) Loop directly through ancestors to apply class, rather than looping through the whole menu
       Because this is always called from makeActive, it should be possible to only grab the ancestors of the active element.
       For most ToCs though, the data is small enough that the performance difference won't matter. */
      nav_links.forEach(link => {
        if (
          link.parentElement.parentElement.getElementsByClassName("active")
            .length !== 0
        ) {
          link.classList.add("active");
        }
      });
    };
    const makeActive = link => {
      nav_links[link].classList.add("active");
      highlightTopLevelHeadingsOfActiveHeading();
    };
    const removeActive = link => nav_links[link].classList.remove("active");
    const removeAllActive = () =>
      /* Could use nav_links.forEach(link, key) => removeActive(key), but you don't actually need the data, 
    so we'll create an empty array of the right length */
      [...Array(sections.length).keys()].forEach(link => removeActive(link));

    const handleClick = link => {
      /* When a user clicks a link, disable the scroll spy and then manually set active class so that the
    active class selection doesn't get overridden by the browser scrolling.*/
      window.removeEventListener("scroll", makeActiveFromScroll);
      removeAllActive();
      makeActive(link);
      toc[0].style.position = "fixed";
      toc[0].style.top = "0";
      setTimeout(
        () => window.addEventListener("scroll", makeActiveFromScroll),
        50
      );
    };
    nav_links.forEach((link, index) => {
      link.addEventListener("click", () => handleClick(index), true);
    });
    /* This number is the distance from the top of the page before a heading will trigger its menu link to become active,
    it defaults to 0 until you hit the first heading, and then changes. If you'd like to adjust it, adjust it in
    makeActiveFromScroll */
    let sectionMargin = 0;

    const makeFixed = element => {
      element.style.position = "fixed";
      element.style.top = "0";
    };
    const makeRelative = element => {
      element.style.position = "relative";
      element.style.top = "";
    };

    const makeActiveFromScroll = () => {
      // current index math from p1xt's blog, you can read about it here: https://medium.com/p1xts-blog/scrollspy-with-just-javascript-3131c114abdc
      const current =
        sections.length -
        [...sections]
          .reverse()
          .findIndex(
            section => window.scrollY >= section.offsetTop - sectionMargin
          ) -
        1;
      if (current === sections.length) {
        removeAllActive();
        currentActive = current;
        makeRelative(toc[0]);
        sectionMargin = 0;
      } else if (current !== currentActive) {
        removeAllActive();
        currentActive = current;
        makeFixed(toc[0]);
        makeActive(current);
        if (current === 0) {
          sectionMargin = 0;
        } else {
          sectionMargin = 100;
        }
      }
    };
    /* Usually, when you have a scroll listener, you want to throttle it. In this case,
    it introduced a bug where if you scrolled fast enough, during the throttled 100ms, the toc stayed 'position: fixed'*/
    window.addEventListener("scroll", makeActiveFromScroll);
  },
  false
);
