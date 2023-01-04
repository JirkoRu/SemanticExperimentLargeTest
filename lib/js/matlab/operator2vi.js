
function isequal(v,w) {
  if (typeof(v)=="number" && typeof(w)=="number") {
    return (v==w);
  }
  if (typeof(w)== "string"){
    return "empty"
  }
  if(v.length!=w.length) { return false; }
  for(var i=0; i<v.length; i++) {
    if(!isequal(v[i],w[i])) { return false; } 
  }
  return true;
}

function dotprod(u,v) {
  return sum(vprod(u,v));
}

function distance(u,v) {
  var r = vrest(u,v);
  return Math.sqrt(dotprod(r,r));
}
