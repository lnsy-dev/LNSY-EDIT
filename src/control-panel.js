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
      console.log(e.target.value);
      this.handleInputChange(e.target.value);
    });
  }

  handleInputChange(new_input){
    console.log(new_input.length)
    if(new_input.length > 1){
      this.results.innerHTML = control_panel_results.map(result => {
        return `<li>${result.name}, ${result.object}</li>`;
      }).join("");
      this.style.display = 'block';
    } else {
      this.style.display = 'none';
    }

  }

}

customElements.define('control-panel-results', ControlPanelResults)

class TestObject extends HTMLElement {
  connectedCallback(){
    const value = this.innerHTML; 
    this.innerHTML = `test object: ${value}`
  }

}

customElements.define('test-object', TestObject)