class PanelIndicator extends HTMLElement {
  connectedCallback(){
    let i = 1;
    while(i < 11){
      const panel_indicator = document.createElement('span');
      panel_indicator.classList.add('panel-indicator');
      panel_indicator.id = `panel-indicator-${i}`
      panel_indicator.innerText = i;
      this.appendChild(panel_indicator);
      i++;
    }

    this.selectPanelIndicator(1);

  }

  selectPanelIndicator(index){
    [...this.querySelectorAll('.panel-indicator')].forEach(panel => {panel.classList.remove('selected')});
    const selected_panel = this.querySelector(`#panel-indicator-${index}`);
    if(selected_panel === null){return}
    selected_panel.classList.add('selected');

  }

  static get observedAttributes() {
    return ['index'];
  }

  attributeChangedCallback(name, old_value, new_value){
    switch(name){
    case "index":
      this.selectPanelIndicator(new_value);
      break
      default:
    }
  }
}

customElements.define('panel-indicator', PanelIndicator)
