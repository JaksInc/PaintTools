(function(){
  // List of color options
  const COLORS = [
    "AXL","BL","CL","DL","EL","FL","IL","JL","KXL","LL",
    "RL","RUL","TL","VL","VUL","YL"
  ];

  // Add shared metadata, icons, stylesheet, and manifest
  function addHeadElements() {
    const head = document.head;
    const tags = [
      {tag:"link", rel:"stylesheet", href:"all-pages.css"},
      {tag:"link", rel:"icon", type:"image/png", sizes:"32x32", href:"/favicon-32x32.png"},
      {tag:"link", rel:"icon", type:"image/png", sizes:"16x16", href:"/favicon-16x16.png"},
      {tag:"meta", name:"viewport", content:"width=device-width, initial-scale=1"},
      {tag:"meta", httpEquiv:"X-UA-Compatible", content:"ie=edge"},
      {tag:"meta", name:"description", content:"Tools for the paint desk."},
      {tag:"meta", name:"theme-color", content:"#888888"},
      {tag:"link", rel:"manifest", href:"manifest.json"}
    ];
    tags.forEach(info => {
      const el = document.createElement(info.tag);
      Object.keys(info).forEach(k => {
        if(k !== 'tag') el.setAttribute(k, info[k]);
      });
      head.appendChild(el);
    });
  }

  // Register service worker
  function registerSW(){
    if('serviceWorker' in navigator){
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js');
      });
    }
  }

  // Build navigation bar
  function buildNav(){
    const nav = document.createElement('nav');
    const links = [
      {href:'scaler.html', text:'Scale'},
      {href:'combiner.html', text:'Combine'},
      {href:'resizer.html', text:'Resize'},
      {href:'https://encycolorpedia.com/', text:'Encycolorpedia', external:true},
      {href:'https://www.easyrgb.com/en/match.php', text:'EasyRGB', external:true}
    ];
    links.forEach(link => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.textContent = link.text;
      a.href = link.href;
      if(link.external) a.classList.add('externalWebsite');
      const path = window.location.pathname.split('/').pop();
      if(!link.external && path === link.href) a.classList.add('active');
      li.appendChild(a);
      nav.appendChild(li);
    });
    document.body.appendChild(nav);
  }

  // Populate color selectors
  function populateColorSelectors(){
    document.querySelectorAll('select.selectedColor').forEach(select => {
      select.innerHTML = '';
      const def = document.createElement('option');
      def.value = 'Select color';
      def.textContent = 'Select color';
      select.appendChild(def);
      COLORS.forEach(color => {
        const opt = document.createElement('option');
        opt.value = color;
        opt.textContent = color;
        select.appendChild(opt);
      });
    });
  }

  // Shared createFormulas function
  function createFormulas(container, includePercentage=false){
    const formulas = [];
    const table = document.querySelector(container);
    for(let i=0; i<table.children.length; i++){
      const color = {};
      const rows = table.children[i].children;
      for(let j=0; j<rows.length; j++){
        const inputs = rows[j].children;
        const colorant = inputs[0].value;
        const ounces = +inputs[1].value;
        const drops = +inputs[2].value;
        if(includePercentage){
          const percentage = +inputs[3].value;
          color[colorant] = [ounces, drops, percentage];
        } else {
          color[colorant] = [ounces, drops];
        }
      }
      formulas.push(color);
    }
    return formulas;
  }

  // Shared displayResults function
  function displayResults(formula){
    const resultsTable = document.getElementById('resultsTable');
    for(let i=0; i<resultsTable.children.length; i++){
      for(let j=0; j<resultsTable.children[i].children.length; j++){
        resultsTable.children[i].children[j].innerHTML = '';
      }
    }
    const resultColorNames = document.getElementById('resultColorNames');
    const resultOunces = document.getElementById('resultOunces');
    const resultDrops = document.getElementById('resultDrops');
    for(const colorant in formula){
      if(colorant === 'Select color') continue;
      const colorName = document.createElement('th');
      colorName.innerHTML = colorant;
      resultColorNames.appendChild(colorName);
      const ounces = document.createElement('td');
      ounces.innerHTML = formula[colorant][0];
      resultOunces.appendChild(ounces);
      const drops = document.createElement('td');
      drops.innerHTML = formula[colorant][1];
      resultDrops.appendChild(drops);
    }
  }

  // Expose functions globally
  window.createFormulas = createFormulas;
  window.displayResults = displayResults;

  // initialize
  addHeadElements();
  registerSW();
  document.addEventListener('DOMContentLoaded', () => {
    populateColorSelectors();
    buildNav();
  });
})();
