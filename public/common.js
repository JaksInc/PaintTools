(function(){
  // List of color options
  const COLORS = [
    "AXL","BL","CL","DL","EL","FL","IL","JL","KXL","LL",
    "RL","RUL","TL","VL","VUL","YL"
  ];

  // Add shared metadata, icons, stylesheet, and manifest
  function addHeadElements() {
    if(document.querySelector('link[href="all-pages.css"]')) return;
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
    if(document.querySelector('nav')) return;
    const nav = document.createElement('nav');
    const links = [
      {href:'scaler.html', text:'Scale'},
      {href:'combiner.html', text:'Combine'},
      {href:'resizer.html', text:'Resize'},
      {href:'differ.html', text:'Differ'},
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
    document.querySelectorAll(container + ' .color').forEach(colorDiv => {
      const color = {};
      colorDiv.querySelectorAll('.formulaRow').forEach(row => {
        const inputs = row.children;
        const colorant = inputs[0].value;
        const ounces = +inputs[1].value;
        const drops = +inputs[2].value;
        if(includePercentage){
          color[colorant] = [ounces, drops, +inputs[3].value];
        } else {
          color[colorant] = [ounces, drops];
        }
      });
      formulas.push(color);
    });
    return formulas;
  }

  function parseFormulaString(str){
    const normalized = str.replace(/\s*:\s*/g, ':').trim();
    if(!normalized) return [];
    return normalized.split(/\s+/).filter(Boolean).map(token => {
      const parts = token.split(':');
      if(parts.length < 3) return null;
      return { color: parts[0], ounces: +parts[1] || 0, drops: +parts[2] || 0 };
    }).filter(Boolean);
  }

  function loadFormulaIntoGrid(colorDiv, entries){
    colorDiv.querySelectorAll('.formulaRow').forEach((row, i) => {
      const select = row.querySelector('select.selectedColor');
      const ouncesInput = row.querySelector('input.ounces');
      const dropsInput = row.querySelector('input.drops');
      const percentageInput = row.querySelector('input.percentage');
      if(i < entries.length){
        if(select) select.value = entries[i].color;
        if(ouncesInput) ouncesInput.value = entries[i].ounces;
        if(dropsInput) dropsInput.value = entries[i].drops;
      } else {
        if(select) select.value = 'Select color';
        if(ouncesInput) ouncesInput.value = '';
        if(dropsInput) dropsInput.value = '';
        if(percentageInput) percentageInput.value = '';
      }
    });
  }

  function buildPasteInputs(){
    document.querySelectorAll('#colorsContainer .color, .colorsContainer .color').forEach(colorDiv => {
      const wrapper = document.createElement('div');
      wrapper.className = 'colorGroup';
      colorDiv.parentNode.insertBefore(wrapper, colorDiv);
      wrapper.appendChild(colorDiv);

      const pasteInput = document.createElement('input');
      pasteInput.type = 'text';
      pasteInput.className = 'formulaPaste';
      pasteInput.placeholder = 'Paste formula (e.g. CL:3:318 IL:0:20)';
      wrapper.insertBefore(pasteInput, colorDiv);

      pasteInput.addEventListener('input', () => {
        const entries = parseFormulaString(pasteInput.value);
        if(entries.length){
          loadFormulaIntoGrid(colorDiv, entries);
          colorDiv.dispatchEvent(new Event('change', {bubbles: true}));
        }
      });
    });
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
  window.parseFormulaString = parseFormulaString;

  // initialize
  addHeadElements();
  registerSW();
  document.addEventListener('DOMContentLoaded', () => {
    populateColorSelectors();
    buildNav();
    buildPasteInputs();
  });
})();
