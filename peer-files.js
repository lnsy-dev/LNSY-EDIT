class PeerFiles extends HTMLElement {
  connectedCallback(){
    
    
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

  updateFileData(filedata){

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


