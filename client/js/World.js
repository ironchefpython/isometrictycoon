!(function (context, factory) {
    if (typeof define === 'function' && define.amd) { define([], factory); }
    else if (typeof exports === 'object') { module.exports = factory(); } 
    else { context.World = factory(); }
}(this, function () { /* BEGIN MODULE */

var coords = function(x, y) {
    return x + ',' + y;
};

var initMap = function(map, Tile) {
    var x,y;
    for (x = 0; x < 10; x++) {
        for (y = 0; y < 10; y++) {
            map[coords(x,y)] = new Tile(x, y);
        }    
    }
    // for (s = 0; s < 10; s++) {
    //     for (w = 0; w < 10; w++) {
    //         this.map[coords(s,w)].adj = {
    //             s:map[coords(s+1,w)],
    //             w:map[coords(s,w+1)], 
    //             b:map[coords(s+1,w+1)]};
    //     }    
    // }
    // map[coords(3,3)].loc.u = 2;
    // map[coords(4,3)].loc.u = 2;
    // map[coords(3,4)].loc.u = 2;
    // map[coords(5,7)].loc.u = 0;
    // map[coords(6,7)].loc.u = 0;
};


var World = function() {

  
    var Tile = function(x, y) {
        this.x = x;
        this.y = y;
        this.heights = [0,0,0,0];
    };  
  
    // Tile.prototype.heights = function(tile) {
    //     tile.heights();
    // };
    

    var W$ = function() {
        for(var i=0; i < arguments.length; i++) {
            this[i] = arguments[i];
        }
        this.length = arguments.length;
    };

    W$.prototype.raise = function() {
        var queue = Array.prototype.slice.call(this);
        // for each tile in queue
        // see if the neighbors are in queue
        // if not see if they need to be raised
        // if so add to queue
        // if cannot raise, return false.
    };
    
    var _this = function(s,w) {
        return new W$(_this.map[coords(s,w)]);
    };
    _this.__proto__ = World.prototype;

    var map = {};
    initMap(map, Tile);
    _this.map = map;
    return _this;
    
    
    




};


    



World.prototype.setRenderCallback = function(cb) {
    this.renderCb = cb;
};

World.prototype.render = function() {
    for(var c in this.map) {
        this.renderCb(this.map[c]);
    }
};


return World;


/* END MODULE */ }));
