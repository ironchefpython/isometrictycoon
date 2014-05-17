(function (context, factory) {
    if (typeof define === 'function' && define.amd) { define([], factory); }
    else if (typeof exports === 'object') { module.exports = factory(); } 
    else { context.UI = factory(); }
}(this, function () {



var highlightAction = function(renderer, viewport) {
    var tile;
    return {
        activate: undefined,
        deactivate:  function() {
            renderer.subdueTile(tile);
        }, 
        mousedown: undefined,
        mouseup: undefined,
        mousemove: undefined,
        tileover: function(e, tile) {
            renderer.highlightTile(tile.geometry);
        },
        tileout: function(e, tile) {
            renderer.subdueTile(tile.geometry);
        }
    };
};

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
    
    $("#view").on("tileover", function(e, tile) {
        console.log(tile);
        renderer.highlightTile(tile.geometry);
    });
    
    $("#view").on("tileout", function(e, tile) {
        renderer.subdueTile(tile.geometry);
    });
    
    $('li#highlight').data("action", highlightAction(renderer, viewport));

    var selectedTool;
    $('li.tool').on("click", function(event) {
        if (selectedTool) {
            selectedTool.removeClass("selected").data("action").deactivate();
        }
        selectedTool = $(this).addClass("selected");
        action = selectedTool.data("action");
        if (action.activate) {
            action.activate();
        }
    });

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

    
    $('li#highlight').click();

    var action;
    
    
};






return UI;

}));