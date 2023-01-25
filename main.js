
const output = document.querySelector('.output');

function logCallback(type, data) {
  
  // remove ' from strings
  data.forEach((item, index) => {
    
    if (item.startsWith('\'') &&
        item.endsWith('\'')) {
      
      data[index] = item.slice(1).slice(0, -1);
      
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

