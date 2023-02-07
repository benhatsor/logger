
const output = document.querySelector('.output');

function logCallback(type, data, rawData) {
  
  if (type === 'clear') {
    
    output.innerHTML = '';
    
    return;
    
  }
  
  if (type === 'errorEvent') {
    
    output.innerHTML += '<div class="item '+ type +'"><a class="type">[' + type + ']</a> <a class="data">' + data + '</a></div>';
    
  }
  
  if (data && data.length !== 0) {
    
    rawData.forEach((item, index) => {
      
      if (data[index] === 'null' ||
          data[index] === 'undefined') {
        
        data[index] = '<span class="token '+ data[index] +'">' + data[index] + '</span>';
        
        return;
        
      }
      
      const type = ({}).toString.call(item);
      
      // remove ' from strings
      if (type === '[object String]') {
        
        data[index] = '<span class="token string">' + logger.utils.escapeHTML(item) + '</span>';
        
      } else if (type === '[object Number]') {
        
        data[index] = '<span class="token number">' + data[index] + '</span>';
        
      } else if (type === '[object Boolean]') {
        
        data[index] = '<span class="token boolean">' + data[index] + '</span>';
        
      } else if (type === '[object Object]' ||
                 type === '[object Array]' ||
                 type === '[object Function]') {
        
        data[index] = '<span class="language-js">' + data[index] + '</span>';
        
      } else {
        
        data[index] = '<span class="language-js">' + data[index] + '</span>';
        
      }
      
    });
  
    // add spaces between adjacent arguments
    data = data.join(' ');
  
    output.innerHTML += '<div class="item '+ type +'"><a class="type">[' + type + ']</a> <a class="data">' + data + '</a></div>';
  
  }
  
}

logger.init(logCallback, window);



console.log('hello');
console.log('hello', 'world"', {'a': 'b', 'c': '"d"', 'e': "'f'"});
console.table({'a':'A','b':'B'}, 5, 6);
console.debug('debug');
console.info('info');
console.warn('warn');
console.error('error');
console.log();
console.log(' ');
console.log(() => { console.log('hello') });
console.log(null, undefined);
console.log([
{
  name: 'one',
  object: {
    a: 'a'
  },
  subscriptions: [
    {
      name: 'a',
      from: 134
    },
    {
      name: 'b',
      from: 167
    }
  ]
}, {}, {}
]);
console.log({a: 'a'}, ['a', 'b'], {'b': 'b'});
console.log(true, false, !false, 234.342, -403.3342342434234342432342234543, logger.utils.escapeHTML);
const test = {
  keys: 5,
  get keysCollected() {
    return this.keys;
  }
};
console.log(test);
console.log('clear' in logger.cW);
console.log(' ');
console.log(' ');
console.log(' ');
console.log('---');
console.log(' ');
console.log({a: logCallback, b: logCallback}, logCallback);

console.log(' ');
console.log([1, 2, 3, { 'a': 3, 2: 'a', b: window }]);
// console.log(output);
// console.log(window);

console.log(undefinedVariableForError);



// function getStack() { console.log(new Error().stack.split('\n')[2]) }


