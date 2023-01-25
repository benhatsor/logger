
const output = document.querySelector('.output');

function logCallback(type, data, rawData) {
  
  if (data) {
    
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
    
  }
  
  // add spaces between adjacent arguments
  data = data.join(' ');
  
  output.innerHTML += '<div class="item '+ type +'"><a class="type">[' + type + ']</a> <a class="data">' + data + '</a></div>';
  
}

logger.init(logCallback, window);

console.log('hello');
console.log('hello', 'world"', {'a': 'b', 'c': '"d"', 'e': "'f'"});
console.table({'a':'A','b':'B'}, 5, 6);
console.log([1, 2, 3, { 'a': 3, 2: 'a', b: window }]);
console.log();
//console.log('output', output);
console.log(() => { console.log('hello') });
console.log(null, undefined);
console.log([{
  name: 'one',
  subscriptions: [
    {
      name: 'a',
      from: 134
    },
    {
      name: 'b',
      from: 167
    }
  ],
}, {}, {}]);
console.log({a: 'a'}, ['a', 'b'], {'b': 'b'});
console.log(true, !false, 234.342, logger.utils.escapeHTML);

