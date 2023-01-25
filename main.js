
const output = document.querySelector('.output');

function logCallback(type, data, rawData) {
  
  // remove ' from strings
  
  if (data) {
    
    rawData.forEach((item, index) => {
      
      const type = ({}).toString.call(item);
      
      if (type === '[object String]') {
        
        data[index] = '<span class="token string">' + logger.utils.escapeHTML(item) + '</span>';
        
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
console.table({'a':'A','b':'B'});

