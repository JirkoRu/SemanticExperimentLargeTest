function shuffleArray(array){
    //-- To shuffle an array a of n elements (indices 0..n-1) using the modern version of Fisher–Yates shuffle:
    // for i from n−1 downto 1 do
    //     j ← random integer such that 0 ≤ j ≤ i
    //     exchange a[j] and a[i]
      var a = JSON.parse(JSON.stringify(array));
      let n = a.length;
      for (let i = n-1; i>0 ; i--) {
        let j = Math.floor(Math.random()*(i+1));
        let tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
      }
      return a
    }
    
function ff2(f1,f2, sortbyf1=true) {
  //generate full factorial combination from two array
  //then return array sort by level of f1 or f2
  let combinations
  if (sortbyf1 === true) {
    combinations = f1.map((x,i)=>f2.map((y,j)=>[].concat(f1[i],f2[j])));
  } else if (sortbyf1 === false) {
    combinations = f2.map((x,i)=>f1.map((y,j)=>[].concat(f1[j],f2[i])));
  }
  combinations   = [].concat(...combinations);
  return(combinations)
}

function ffn(...args) {
  //generate full factorial combination from multiple array
  //then return array sort firstly by levels of f1, secondly by f2 ...fn
  const n = arguments.length;
  let fn1 = arguments[n-1];
  let fn2 = arguments[n-2];
  let ff = ff2(fn2,fn1)
  if (n>=3) {
    for (let i = n-3; i>=0; i--){
      ff = ff2(arguments[i],ff)
    }
  }
  return(ff)
}

function SelectByKey(array,key){
  if(key===undefined){
    key = [...Array(array.length).keys()];
  }
  let new_array = key.map((x)=>array[x]);
  return(new_array)
}

function getQueryParams() {
  var qs = document.location.search.split("+").join(" ");
  var params = {},
      tokens,
      re = /[?&]?([^=]+)=([^&]*)/g;

  while (tokens = re.exec(qs)) {
      params[decodeURIComponent(tokens[1])]
          = decodeURIComponent(tokens[2]);
  }

  return params;
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
