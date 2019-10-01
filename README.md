# confluence-floating-toc

A simple JS + CSS approach to making the Confluence Table of Contents macro float and highlight the currently active Heading

Playing with it is probably more valuable than a picture of it, so here's a working demo:
https://codepen.io/SimmonsPen/pen/yLBwBLN

## House Keeping

### Attributions

This project was inspired by **Wade Tracy**'s implementation
https://community.atlassian.com/t5/Boise/Widget-Wednesday-Floating-TOC-in-Confluence/

And by **Bootstrap**'s docs floating ToC
https://getbootstrap.com/docs/3.3/css/

### Motivation

Confluence's Table of Contents Macro is pretty bare bones, and a friend wanted a more user-friendly version.

## Instructions

### Before we get started

For clarity, this was made for **Confluence Server 6.15.2**, if it fails terribly on whatever your setup is, let me know.

You'll need to enable Confluence's **HTML** macro to do this. Instructions for that are available at https://confluence.atlassian.com/doc/html-macro-38273085.html as well as a fairly well worded explanation as to why it's disabled by default. Please read that. Basically, if your userbase isn't exclusively people you trust, maybe don't rely on this solution.

### Step by Step

Wade Tracy's instructions for getting this setup are excellent and easier to follow than anything I'd come up with, so lets follow along with his guidance:

There are two pieces required for getting this to work. First you must add a Table of Contents macro with the correct settings and then you must add an HTML macro with the CSS and Javascript.

#### Table of Contents Macro

1. Divide the layout of your page so that there is an empty column on the right of the page where the menu will float.
2. Add a **Table of Contents** macro and set the heading levels to include all headings (h1-h6) (note that only the first three heading levels will be indented)
3. Should you choose not have all headings in your ToC, you'll have to edit the Readable Code

   1. Search for the line

   ```
   const sections = document.querySelectorAll(
   ".innerCell > h1, .innerCell > h2, .innerCell > h3, .innerCell > h4, .innerCell > h5, .innerCell > h6"
   );
   ```

   2. Delete the selectors for the headings that won't appear in your Table of Contents. ie. if you only wanted h2-h4 you'd use

   ```
   const sections = document.querySelectorAll(
   ".innerCell > h2, .innerCell > h3, .innerCell > h4"
   );
   ```

   3. Pat yourself on the back for saving me time implementing a better solution

4. Uncheck the box for **Printable** and enter **ts-toc-btf** as the **CSS Class Name**
5. Save the page.

#### HTML Macro

1. Add an **HTML** macro anywhere on the page (it isn't visible and it is easier to keep track of if you put it under the **Table of Contents** macro):
2. Copy the **Minified** code below and paste it into the **HTML** macro.
3. Tweak style settings if desired–the **Readable** code below can help identify what changes can be made.

#### If it doesn't work

Tell me.

## Code

### Minified

```
<style>
.ts-toc-btf{position:relative;overflow-wrap:normal;font-size:13px;line-height:1.5}.ts-toc-btf p{font-weight:700}.ts-toc-btf>ul>li>span>a.active{font-weight:700}.ts-toc-btf ul{list-style:none;padding-left:0}.ts-toc-btf ul a{padding:4px 10px}.ts-toc-btf ul ul a{font-size:12px;padding:4px 20px}.ts-toc-btf ul ul ul a{padding:4px 30px}.ts-toc-btf a{color:#767676!important;text-decoration:none}.ts-toc-btf a:hover{color:#4a72c2!important;box-shadow:inset 2px 0 0 #4a72c2}.ts-toc-btf a.active{color:#0052cc!important;box-shadow:inset 2px 0 0 #0052cc}@media (max-width:900px){.ts-toc-btf{display:none}}
</style>
<script>
document.addEventListener("DOMContentLoaded",function(){let a=document.getElementsByClassName("ts-toc-btf"),b=document.createElement("p");const c=document.createTextNode("On this page");b.appendChild(c),a[0].insertBefore(b,a[0].firstChild);const d=document.querySelectorAll(".innerCell > h1, .innerCell > h2, .innerCell > h3, .innerCell > h4, .innerCell > h5, .innerCell > h6"),e=document.querySelectorAll(".ts-toc-btf a");e.forEach(a=>a.textContent=a.textContent.trim());let f=d.length;const g=()=>{e.forEach(a=>{0!==a.parentElement.parentElement.getElementsByClassName("active").length&&a.classList.add("active")})},h=a=>{e[a].classList.add("active"),g()},i=a=>e[a].classList.remove("active"),j=()=>[...Array(d.length).keys()].forEach(a=>i(a)),k=b=>{window.removeEventListener("scroll",o),j(),h(b),a[0].style.position="fixed",a[0].style.top="0",setTimeout(()=>window.addEventListener("scroll",o),50)};e.forEach((a,b)=>{a.addEventListener("click",()=>k(b),!0)});let l=0;const m=a=>{a.style.position="fixed",a.style.top="0"},n=a=>{a.style.position="relative",a.style.top=""},o=()=>{const b=d.length-[...d].reverse().findIndex(a=>window.scrollY>=a.offsetTop-l)-1;b===d.length?(j(),f=b,n(a[0]),l=0):b!==f&&(j(),f=b,m(a[0]),h(b),l=0==b?0:100)};window.addEventListener("scroll",o)},!1);
</script>
```

### Readable

```
<style>
.ts-toc-btf {
  position: relative;
  overflow-wrap: normal;
  font-size: 13px;
  line-height: 1.5;
}

/* Only used for the "on this page text" */
.ts-toc-btf p {
  font-weight: bold;
}

/* Bold active top level links */
.ts-toc-btf > ul > li > span > a.active {
  font-weight: bold;
}

/*
padding-left controls the auto indentation of lists
but, unfortunately, the left border that we're adding
gets indented as well. The following css is to control
the padding of nested list items.
*/
.ts-toc-btf ul {
  list-style: none;
  padding-left: 0px;
}

.ts-toc-btf ul a {
  padding: 4px 10px;
}

.ts-toc-btf ul ul a {
  font-size: 12px;
  padding: 4px 20px;
}

.ts-toc-btf ul ul ul a {
  padding: 4px 30px;
}

/* Colors */
/* box-shadow instead of border-left because it doesn't affect
spacing */
.ts-toc-btf a {
  color: #767676 !important;
  text-decoration: none;
}
.ts-toc-btf a:hover {
  color: #4a72c2 !important;
  box-shadow: inset 2px 0px 0px #4a72c2;
}

.ts-toc-btf a.active {
  color: #0052cc !important;
  box-shadow: inset 2px 0px 0px #0052cc;
}

/* Don't show the toc on narrow windows */
@media (max-width: 900px) {
  .ts-toc-btf {
    display: none;
  }
}
</style>
<script>
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
</script>
```
