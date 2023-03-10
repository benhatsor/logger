

// todo: error handling
// --------------------
// next steps:
// - custom Prism theme for objects & arrays
// - origin file & line number with getStack() - see main.js

let logger = {

  log: null,
  cW: null,
  
  overrides: {},
  
  options: {
    
    disabledCb: [],
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
    // (using .getOwnPropertyNames() instead of .keys() to get innumerable props)
    const consoleFuncs = Object.getOwnPropertyNames(logger.cW.console)
                          .filter(item => (typeof logger.cW.console[item] === 'function'));
    
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
    
    // if "clear()" function exists
    if ('clear' in logger.cW &&
        typeof logger.cW.clear === 'function') {
      
      // override "clear()" function
      logger.overrideFunc('clear', logger.cW);
      
    }
    
    // override errors (dosen't override console.error)
    logger.cW.addEventListener('error', (e) => {
      
      const resp = 'Uncaught ' + e.error.stack;
      const data = e;
      
      // log
      logger.log('errorEvent', resp, data);
      
    });
    
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
      logger.log(funcName, resp, data);
      
      // show in browser console
      if (logger.options.enableBrowserConsole) {
        
        // call original function with data
        logger.overrides[funcName].apply(parentClass, data);
        
      }
      
    }
    
  },
  
  
  cb: {
    
    log: (data) => {
      
      // parse data
      const resp = logger.utils.parseLogData(data);
      
      return resp;
      
    },
    
    /* table: (data) => {

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
        
        resp[index] = logger.utils.escapeHTML(logger.utils.stringify(item));

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
     * Note: Does not escape HTML.
     * https://github.com/jsbin/jsbin
     */
    stringify: (function () {

      var sortci = function(a, b) {
        return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
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
          
          const func = o.toString();
          
          // if not in object
          if (buffer.length / 2 < 1) {
            
            /*
            if (func.startsWith('function')) {
              
              // replace 'function' with 'f'
              let resp = func.replace('function', '');
              if (resp.startsWith(' ')) resp = resp.replace(' ', '');
              
              resp = 'f ' + resp;
              
              return resp;
              
            } else {
              
              // return function
              return func;
              
            }
            */
            
            // return function
            return func.split('\n  ').join('\n  ' + buffer);
        
          } else {
            
            if (func.startsWith('function')) {
              
              // return function without contents
              let resp = func.split(')')[0] + ')';
              
              /*
              // replace 'function' with 'f'
              resp = resp.replace('function', '');
              if (resp.startsWith(' ')) resp = resp.replace(' ', '');
              
              resp = 'f ' + resp;
              */
              
              return resp;
              
            } else {
              
              // return function
              return func.split('\n  ').join('\n' + buffer);
              
            }
            
          }
          
        }
        if (type == '[object String]') {
          
          let string = o;
          
          // if not in object
          if (buffer.length / 2 < 1) {
            
            return string;
            
          } else {
            
            // replace newlines with "\n"
            string = string.replace(/\n/g, '\\n');
            
            // surround string with quotes
            string = '"' + string.replaceAll(/"/g, '\\"') + '"';
            
            return string; 
            
          }
          
        }

        // Check for circular references
        for (vi = 0; vi < visited.length; vi++) {
          if (o === visited[vi]) {
            // Show that a circular object was found
            
            const typeStr = type.replace('[object ', '').replace(']', '');
            
            /*
            // if available, show the object's nodeName (for nodes)
            if ('nodeName' in o) {
              
              return o.nodeName.toLowerCase();
              
            } else {*/
              
            return typeStr + ' {...}';
              
            /*}*/
            
            /*
            return '[' + circular ' + type.slice(1) +
              ('outerHTML' in o ? ':\n' + (o.outerHTML).split('\n').join('\n' + buffer) : '')
            */
            
          }
        }

        // Remember that we visited this object
        visited.push(o);

        // Stringify each member of the array
        if (type == '[object Array]') {
          for (i = 0; i < o.length; i++) {
            parts.push(stringify(o[i], visited, buffer));
          }
          return '[' + parts.join(', ') + ']';
        }

        // Fake array ??? very tricksy, get out quickly
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

        typeStr = typeStr.replace('[object ', '').replace(']', '');

        // If nothing was gathered, return empty object
        if (!parts.length) return typeStr + '{...}';
        
        const excludeTypes = ['Object', 'Array', 'Number', 'Boolean', 'Function', 'String'];
        
        if (excludeTypes.includes(typeStr.slice(0, -1))) {
          typeStr = '';
        } else { // if type isn't in list
          
          /*
          // if object has a node name
          if ('nodeName' in o && o.nodeName !== '') {
              
            typeStr = o.nodeName.toLowerCase() + ' ';
              
          }*/
          
        }
        
        // Return the indented object with new lines
        return typeStr + '{\n' + parts.join(',\n') + '\n' + buffer + '}';
      };
    }())
    
  }
    
}

