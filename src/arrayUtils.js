class ArrayUtils {
  constructor({
    server
  }) {
    this.server = server;
  }

  mapFromArray(array, prop) {
    const map = {};
    for (let i = 0; i < array.length; i++) {
      map[array[i][prop]] = array[i];
    }
    return map;
  }

  isEqual(a, b) {
    return a.clicks === b.clicks;
  }

  /**
   * @param {object[]} o old array of objects
   * @param {object[]} n new array of objects
   * @param {object} An object with changes
   */
  getDelta(o, n, comparator) {
    const delta = {
      added: [],
      deleted: [],
      changed: []
    };
    const mapO = this.mapFromArray(o, 'id');
    const mapN = this.mapFromArray(n, 'id');
    for (let id in mapO) {
      if (!mapN.hasOwnProperty(id)) {
        delta.deleted.push(mapO[id]);
      } else if (!comparator(mapN[id], mapO[id])) {
        mapO[id] = mapN[id];
        delta.changed.push(mapN[id]);
      }
    }

    for (let id in mapN) {
      if (!mapO.hasOwnProperty(id)) {
        delta.added.push(mapN[id])
      }
    }
    return delta;
  }

  syncUpArray(array1, array2) {
    return this.getDelta(array1, array2, this.isEqual);
  }

  compareAndUpdate(array1, array2) {
    for (let i = 0; i < array1.length; i++) {
      for (let k = 0; k < array2.length; k++) {
        if (array1[i].id === array2[k].id) {
          if (array1[i].clicksToUpdate) {
            array1[i].clicksToUpdate = parseInt(array1[i].clicksToUpdate) + parseInt(array2[k].clicksToUpdate);
          } else {
            array1[i].clicksToUpdate = array2[k].clicksToUpdate;
          }
          array2[k].clicksToUpdate = '0';
          array1[i].clicksToUpdate = array1[i].clicksToUpdate.toString();
        }
      }
    }
  }

}

module.exports = ArrayUtils;