const control_panel_results = [
  {
    name: "test",
    object: `<test-object>Object 2</test-object>`
  },
  {
    name: "blahtest",
    object: `<test-object>object 3</test-object>`
  },

]

class ControlPanelResults extends HTMLElement {
  connectedCallback(){
    this.style.display = 'none';
    this.results = document.createElement('ul');
    this.appendChild(this.results)
    control_panel.addEventListener('keyup', (e) => {
      this.handleInputChange(e.target.value);
    });
  }

  handleInputChange(new_input){

    const handleArrowKeys = (e) =>{
      if(e.code === 'ArrowDown'){
        console.log('down');
      } else if(e.code === 'ArrowUp'){
        console.log('up');
      } else {
        return
      }
    }

    if(new_input.length > 1){
      this.results.innerHTML = control_panel_results.map(result => {
        return `<li>${result.name}, ${result.object}</li>`;
      }).join("");

      this.style.display = 'block';
      document.addEventListener('keydown', handleArrowKeys);
    } else {
      document.removeEventListener('keydown', handleArrowKeys)
      this.style.display = 'none';
    }

  }

}

customElements.define('control-panel-results', ControlPanelResults)
