class PeerFiles extends HTMLElement {
  connectedCallback(){
    this.peers = this.getAttribute('peers')
    if(peers === null){
      this.peers = []
    }

    const new_file_button = document.createElement('button')
    new_file_button.addEventListener('click', () => this.createNewFile())
    
  }

  createNewFile(){
    
  }

  listFiles(){


  }

  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(name, old_value, new_value){
    switch(name){
      default:
    }
  }

}

customElements.define('peer-files', PeerFiles)


class PeerFile extends HTMLElement {
  connectedCallback(){


  }


  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(name, old_value, new_value){
    switch(name){
      default:
    }
  }

}

customElements.define('peer-file', PeerFile)


