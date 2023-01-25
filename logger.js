

let logger = {

  log: null,
  cW: null,
  
  overrides: {},
  
  options: {
    
    disabledCb: [],
    parseOutput: true,
    enableBrowserConsole: true,
    
  },
  
  init: (logCallback, contextWindow = window, options = {}) => {

    logger.cW = contextWindow;
    
    logger.log = logCallback;
    
    // apply options
    if (options && options.typeof === 'object') {
      
      Object.entries(options).forEach((oName, oValue) => {
        
        logger.options[oName] = oValue;
        
      });
      
    }
    
    // override all logs
    logger.override();

  },
  
  
  override: () => {
    
    // get all console functions in context
    const consoleFuncs = Object.keys(logger.cW.console);
    
    consoleFuncs.forEach(func => {
      
      // if console function enabled
      if (!logger.options.disabledCb[func]) {
        
        // override console function
        logger.overrideFunc(func, logger.cW.console);

      } else {
        
        // if disabled callback exists 
        if (logger.cb.disabled) {

          // disable console function
          logger.overrideFunc('disabled', logger.cW.console);
          
        }
        
      }
      
    });
    
    // override "clear()" function
    if (logger.cW.clear) {
      
      // override console function
      logger.overrideFunc('clear', logger.cW);
      
    }
    
  },
  
  
  // override function
  overrideFunc: (funcName, parentClass) => {
    
    let callback = logger.cb[funcName];

    // if callback dosen't exist,
    // use default callback
    if (!callback) callback = logger.cb.default;
    
    
    // save original function in array
    logger.overrides[funcName] = parentClass[funcName];
    
    // override function
    parentClass[funcName] = (...data) => {
      
      let resp = undefined;
      
      // callback with data
      resp = callback(data);
      
      // log
      logger.log(funcName, resp);
      
      // show in browser console
      if (logger.options.enableBrowserConsole) {
        
        // call original function with data
        logger.overrides[funcName].apply(parentClass, data);
        
      }
      
    }
    
  },
  
  
  cb: {
    
    log: (data) => {
      
      let resp;
      
      if (logger.options.parseOutput) {
       
        // parse data
        resp = logger.utils.parseLogData(data);
        
      } else {
        
        // escape HTML
        resp = logger.utils.escapeHTMLlogData(data);
        
      }
      
      return resp;
      
    },
    
    /* table: (data) => {
      
      if (!data) return data;
      
      // escape HTML
      const resp = logger.utils.escapeHTMLlogData(data);
      
      // return raw data
      return resp;
      
    }, */
    
    clear: (data) => {
      
      return;
      
    },
    
    
    // standard functions

    // disabled: (data) => { ... },
    
    default: (data) => {
      
      // log
      return logger.cb.log(data);

    }
    
  },
  


  utils: {

    parseLogData: (data) => {
      
      const resp = [];
      
      // parse data       
      data.forEach((item, index) => {
        
        resp[index] = htmlEntities(logger.utils.stringify(item));

      });
      
      return resp;
      
    },
    
    escapeHTMLlogData: (data) => {

      const resp = [];

      // escape HTML
      data.forEach((item, index) => {

        resp[index] = logger.utils.escapeHTML(item);

      });
      
      return resp;

    },
    
    // escape HTML
    escapeHTML: (str) => {
    
      const p = document.createElement('p');
      p.appendChild(document.createTextNode(str));
    
      let resp = p.innerHTML;
      resp = resp.replaceAll(/"/g, "&quot;").replaceAll(/'/g, "&#039;");
    
      return resp;
    
    },
    
    /**
     * Stringify
     * Inspect native browser objects and functions.
     * https://github.com/jsbin/jsbin
     */
    stringify: (function () {

      var sortci = function(a, b) {
        return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
      };

      var htmlEntities = function (str) {
        //return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        
        const p = document.createElement('p');
        p.appendChild(document.createTextNode(str));
      
        let resp = p.innerHTML;
        resp = resp.replaceAll(/"/g, "&quot;").replaceAll(/'/g, "&#039;");
      
        return resp;
      
      };

      /**
       * Recursively stringify an object. Keeps track of which objects it has
       * visited to avoid hitting circular references, and a buffer for indentation.
       * Goes 2 levels deep.
       */
      return function stringify(o, visited, buffer) {
        var i, vi, type = '', parts = [], circular = false;
        buffer = buffer || '';
        visited = visited || [];

        // Get out fast with primitives that don't like toString
        if (o === null) {
          return 'null';
        }
        if (typeof o === 'undefined') {
          return 'undefined';
        }

        // Determine the type
        try {
          type = ({}).toString.call(o);
        } catch (e) { // only happens when typeof is protected (...randomly)
          type = '[object Object]';
        }

        // Handle the primitive types
        if (type == '[object Number]') {
          return ''+o;
        }
        if (type == '[object Boolean]') {
          return o ? 'true' : 'false';
        }
        if (type == '[object Function]') {
          return o.toString().split('\n  ').join('\n' + buffer);
        }
        if (type == '[object String]') {
          return "'" + /*htmlEntities*/(o.replace(/'/g, "\\'")) + "'";
        }

        // Check for circular references
        for (vi = 0; vi < visited.length; vi++) {
          if (o === visited[vi]) {
            // Notify the user that a circular object was found and, if available,
            // show the object's outerHTML (for body and elements)
            return '[' + /* circular ' + */ type.slice(1) +
              ('outerHTML' in o ? ' :\n' + /*htmlEntities*/(o.outerHTML).split('\n').join('\n' + buffer) : '')
          }
        }

        // Remember that we visited this object
        visited.push(o);

        // Stringify each member of the array
        if (type == '[object Array]') {
          for (i = 0; i < o.length; i++) {
            parts.push(stringify(o[i], visited));
          }
          return '[' + parts.join(', ') + ']';
        }

        // Fake array – very tricksy, get out quickly
        if (type.match(/Array/)) {
          return type;
        }

        var typeStr = type + ' ';
        var newBuffer = buffer + '  ';

        // Dive down if we're less than 2 levels deep
        if (buffer.length / 2 < 2) {

          var names = [];
          // Some objects don't like 'in', so just skip them
          try {
            for (i in o) {
              names.push(i);
            }
          } catch (e) {}

          names.sort(sortci);
          for (i = 0; i < names.length; i++) {
            try {
              parts.push(newBuffer + names[i] + ': ' + stringify(o[names[i]], visited, newBuffer));
            } catch (e) {}
          }

        }

        // If nothing was gathered, return empty object
        if (!parts.length) return typeStr.replace('[object ', '').replace(']', '') + '{...}';

        // Return the indented object with new lines
        return /* typeStr + */ '{\n' + parts.join(',\n') + '\n' + buffer + '}';
      };
    }())
    
  }
    
};

