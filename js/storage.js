var Storage = new (function() {
  var self = this,
      id = '0hn0_storage',
      data = {
        q: 42,
        bestTimeSize5: 300,
        bestTimeSize6: 360,
        bestTimeSize7: 420,
        bestTimeSize8: 480,
        autoSignIn: true,
        showTimeTrial: false
      };

  $(init);

  function init() {
    // load data from localStorage
    getItem(id, function(obj) {
      if (obj && obj[id]) {
        // get the stringified data
        var str = obj[id],
            tempData = JSON.parse(str);
        // if the data can be parsed and q = 42 then we're ok!
        if (tempData && tempData.q == 42)
          data = tempData;
      }
    })
  }

  function save() {
    setItem(id, JSON.stringify(data));
  }

  // the big gate where completed levels pass through
  function levelCompleted(size, score, seconds, isTutorial, hintsUsed, undosUsed) {

    // accept size 4 for the tutorial only
    if (!size || size < 4 || size > 8) return;
    if (!seconds || isNaN(seconds)) return;

    // first check if this was the tutorial
    if (isTutorial)  {
      return;
    }

    // do not accept size 4 anymore
    if (size < 5) return;

    // check if this time was better than the last
    var currentBestTime = data['bestTimeSize' + size];
    if (!isNaN(currentBestTime) && seconds < currentBestTime) {
      data['bestTimeSize' + size] = seconds;
    }

    save();
  }

  function getDataValue(name, defaultValue) {
    if (data[name] === undefined) {
      if (defaultValue != undefined)
        return defaultValue;
      else
        return false;
    }
    return data[name];
  }

  function setDataValue(name, value) {
    data[name] = value;
    save();
  }

  function getItem(name, cb) {
    if ($.browser.chromeWebStore) {
      chrome.storage.local.get(name, cb);
    }
    else {
      var result = {};
      result[name] = localStorage.getItem(name);
      cb(result);
    }
  }

  function setItem(name, value, cb) {
    if ($.browser.chromeWebStore) {
      var command = {};
      command[name] = value;
      chrome.storage.local.set(command, cb);
    }
    else {
      localStorage.setItem(name, value);
      if (cb)
        cb();
    }
  }

  function clear(cb) {
    if ($.browser.chromeWebStore)
      chrome.storage.local.clear(cb);
    else {
      localStorage.clear();
      if (cb)
        cb();
    }
  }

  this.getItem = getItem;
  this.setItem = setItem;
  this.clear = clear;
  this.levelCompleted = levelCompleted;
  this.setDataValue = setDataValue;
  this.getDataValue = getDataValue;
  this.__defineGetter__('data', function() { return data; });
})();