import "./panel-indicator.js";

class DataPanels extends HTMLElement {
  connectedCallback(){
    this.innerHTML = `<panel-indicator index="1"></panel-indicator>`
    for (let i = 1; i <= 10; i++) {
      const panel = document.createElement('div');
      panel.id = `panel-${i}`;
      panel.className = 'panel';
      panel.textContent = `Panel ${i}`;
      this.appendChild(panel);
    }

    document.addEventListener('keydown', (event)=> {
      if (event.ctrlKey) {
        let panelNumber = event.key === '0' ? 10 : parseInt(event.key);
        if (panelNumber >= 1 && panelNumber <= 10) {
          this.bringToFront(panelNumber);
        }
      }
    });
  }

  bringToFront(panelIndex) {
    // Reset z-index for all panels
    document.querySelectorAll('.panel').forEach(panel => {
      panel.style.zIndex = 1;
    });

    document.querySelector('panel-indicator').setAttribute('index', panelIndex);

    // Bring the specified panel to the front
    document.getElementById(`panel-${panelIndex}`).style.zIndex = 10;
  }
}

customElements.define('buffer-panels', DataPanels)

/*

document.addEventListener('DOMContentLoaded', function() {
  const container = document.body;

});



function 

*/