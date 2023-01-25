
const output = document.querySelector('.output');

function logCallback(type, data) {
  
  // remove ' from strings
  
  const stringChar = logger.utils.escapeHTML('\'');
  
  data.forEach((item, index) => {
    
    if (item.startsWith(stringChar) &&
        item.endsWith(stringChar)) {
      
      item = item.slice(stringChar.length).slice(0, -stringChar.length);
      
      item = item.replaceAll('\\' + stringChar, stringChar);
      
      data[index] = item;
            
    }
    
  });
  
  // add spaces between adjacent arguments
  data = data.join(' ');
  
  output.innerHTML += '<div class="item '+ type +'"><a class="type">[' + type + ']</a> <a class="data">' + data + '</a></div>';
  
}

logger.init(logCallback, window);

console.log('hello');
console.log('hello', 'world"', {'a': 'b', 'c': '"d"', 'e': "'f'"});
console.table({'a':'A','b':'B'});

