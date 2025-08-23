export default class FileClerk {
  #fileHandle = null;

  newFile() {
    this.#fileHandle = null;
  }

  async load() {
    try {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [{
          description: 'HTML Files',
          accept: {
            'text/html': ['.html', '.htm']
          }
        }]
      });
      const file = await fileHandle.getFile();
      const contents = await file.text();
      this.#fileHandle = fileHandle;
      return {
        name: file.name,
        content: contents,
      };
    } catch (e) {
      if (e.name === 'AbortError') {
        return null;
      }
      throw e;
    }
  }

  async save(contents) {
    if (this.#fileHandle) {
      const writable = await this.#fileHandle.createWritable();
      await writable.write(contents);
      await writable.close();
      const file = await this.#fileHandle.getFile();
      return file.name;
    } else {
      return this.saveAs(contents);
    }
  }

  async saveAs(contents) {
    try {
      const fileHandle = await window.showSaveFilePicker({
        types: [{
          description: 'HTML Files',
          accept: {
            'text/html': ['.html', '.htm']
          }
        }]
      });
      const writable = await fileHandle.createWritable();
      await writable.write(contents);
      await writable.close();
      this.#fileHandle = fileHandle;
      const file = await fileHandle.getFile();
      return file.name;
    } catch (e) {
      if (e.name === 'AbortError') {
        return null;
      }
      throw e;
    }
  }
}