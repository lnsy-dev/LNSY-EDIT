import './localforage.min.js';

class FileClerk extends HTMLElement {
  constructor(){
    super();
    this.initialize();
  }

  async initialize(){
    this.id = await this.getUUID();

  }

  saveFile(id){

  }

  loadFile(id){

  }

  dumpFiles(){

  }

  async getUUID(){
    if(this.uuid){
      return this.uuid;
    } else {
      const uuid = await localforage.getItem(window.location.host);
      if(uuid === null){
        await this.generateNewKey();
        return this.uuid;
      } else {
        return uuid
      }
    }
  }

  async generateNewKey(){
    this.uuid = self.crypto.randomUUID();
    await localforage.setItem(window.location.host, this.uuid);
    this.qr_code.setAttribute('value',  `${window.location.href}?&target=${this.uuid}`);
    this.createConnection();
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

customElements.define('file-clerk', FileClerk)


