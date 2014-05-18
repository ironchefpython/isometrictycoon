(function (context, factory) {
    if (typeof define === 'function' && define.amd) { define([], factory); }
    else if (typeof exports === 'object') { module.exports = factory(); } 
    else { context.UI = factory(); }
}(this, function () {

var NOP = function() {};

$('li#highlight').data("action", function(renderer, viewport) {
    var lasttile = null;
    var subdue = function() {
        if (lasttile) {
            renderer.subdueTile(lasttile);
            lasttile = null;
        }
    };
    return {
        activate: NOP,
        deactivate: subdue, 
        mousedown: NOP,
        mouseup: NOP,
        mousemove: NOP,
        tileover: function(e, tile) {
            renderer.highlightTile(tile);
            lasttile = tile;
        },
        tileout: subdue,
        pointover: NOP,
        pointout: NOP
    };
});

$('li#terraform').data("action", function(renderer, viewport) {
    var lastpoint = null;
    var dragging = false;
    var endDrag = function() {
        if (dragging) {
            dragging = false;
        }
        if (lastpoint) {
            renderer.subduePoint(lastpoint);
            lastpoint= false;
        }
    };
    return {
        activate: NOP,
        deactivate:  endDrag, 
        mousedown: NOP,
        mouseup: NOP,
        mousemove: NOP,
        tileover: NOP,
        tileout: NOP,
        pointover:  function(e, point) {
            renderer.highlightPoint(point);
            lastpoint = point;
        },
        pointout: function(e, point) {
            if (!dragging && lastpoint) {
                renderer.subduePoint(lastpoint);
                lastpoint = null;
            }
        }
    };
});



    // $('li#terraform').data("action", new ActionObj({
    //     activate: function() {
    //         renderer.addPointHighlight();
    //         return this;
    //     },
    //     deactivate:  function() {
    //         renderer.clearPointHighlight();
    //     }, 
    //     mousedown:  function(event) {
    //         this.dragging = true;
    //         this.startY = event.pageY;
    //     },
    //     mouseup:  function(event) {
    //         this.dragging = false;
    //     },
    //     mousemove:  function(event) {
    //         if (this.dragging) {
    //             renderer.previewTerraform(this.point, event.pageY - this.startY);
    //         } else {
    //             this.point = renderer.getNearestPoint(event.pageX, event.pageY);
    //             renderer.highlightPoint(this.point);
    //         }
    //     },
    // }));



var UI = function($, world, renderer) {
    var viewport = renderer.addViewport($("#view")[0]);
    world.render();
    renderer.startRender();
    
    var selectedTool;
    var action;

    $('li.tool').on("click", function(event) {
        if (selectedTool) {
            action.deactivate();
            selectedTool.removeClass("selected");
        }
        
        selectedTool = $(this).addClass("selected");
        action = selectedTool.data("action")(renderer, viewport);
        action.activate();
        
        console.log(action);
    });
    $('li#highlight').click();


    $("#view").on("mousedown", function(event) {
        action.mousedown(event);
    });

    $("#view").on("mouseup", function(event) {
        action.mouseup(event);
    });

    $("#view").on("tileover", function(event, tile) {
        action.tileover(event, tile);
    });

    $("#view").on("tileout", function(event, tile) {
        action.tileout(event, tile);
    });
    
    $("#view").on("pointover", function(event, point) {
        action.pointover(event, point);
    });

    $("#view").on("pointout", function(event, point) {
        action.pointout(event, point);
    });
    
    
    
};






return UI;

}));