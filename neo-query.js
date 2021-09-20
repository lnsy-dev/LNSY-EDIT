
class NeoQuery extends HTMLElement {

  connectedCallback(){
    // get the attribute called title, if it is null assign a new one

    this.secret_key = this.getAttribute('secret-key')
    if(this.secret_key === null){
      this.innerHTML = 'NO SECRET KEY, CANCELLING'
      return
    } 
    this.removeAttribute('secret-key')


    this.server_address = this.getAttribute('server-address')
    if(this.server_address === null){
      this.innerHTML = 'NO SERVER ADDRESS, CANCELLING'
      return
    } 
    this.removeAttribute('server-address')

    this.user_key = this.getAttribute('user-key')
    if(this.user_key === null){
      this.innerHTML = 'NO USER KEY, CANCELLING'
      return
    } 

    this.removeAttribute('user-key')

    this.neoserver = js2neo.open({
      host: this.server_address, 
      user: this.user_key, 
      password: this.secret_key
    })

    this.neoserver.onOpen = (metadata) => {
      this.innerHTML = JSON.stringify(metadata)
    }

    this.neoserver.onInitFailure  = (err) => {
      console.log(err)
    }

    this.innerHTML = 'LOADED'


    this.query = this.getAttribute('query')
    if(this.query === null){
      this.query = ''
    } 

    this.query_parameters = this.getAttribute('query-parameters')
    if(this.query_parameters === null){
      this.query_parameters = {}
    } 

  }

  handleRecord(record){
    this.innerHTML = JSON.stringify(record)
    console.log(record)
  }
  
  static get observedAttributes() {
    return ['query','query-parameters'];
  }

  attributeChangedCallback(name, old_value, new_value){

    if(name === 'query-parameters'){
      this.query_parameters = JSON.parse(new_value)
    } 

    if(name  === 'query' || name === 'query-parameters'){

      this.query = new_value

      this.neoserver.run(
        new_value, 
        this.query_parameters,
        {onRecord: (record) => {this.handleRecord(record)}}
        )
    }
  }

  disconnectedCallback() {
    console.log('Custom square element removed from page.')
  }
  adoptedCallback() {
    console.log('Custom square element moved to new page.')
  }
}


customElements.define('neo-query', NeoQuery)