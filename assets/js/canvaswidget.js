$.widget('ui.canvasWidget', {
    _layers: new Object(),
    _paper: null,
    _create: function () {
        var that = this,
                $element = that.element;

        this._paper = Raphael($element.attr('id'), "100%", "100%");

        that._start = function () {
            // storing original coordinates
            this.ox = this.attr("x");
            this.oy = this.attr("y");
            this.attr({opacity: 1});

            this.sizer.ox = this.sizer.attr("x");
            this.sizer.oy = this.sizer.attr("y");
            this.sizer.attr({opacity: 0.5});
            console.log(this.poppable)
            if (this.poppable) {
                this.toFront();
            }
        };
        that._move = function (dx, dy) {
            // move will be called with dx and dy
            this.attr({x: this.ox + dx, y: this.oy + dy});
            this.sizer.attr({x: this.sizer.ox + dx, y: this.sizer.oy + dy});
        };
        that._up = function () {
            // restoring state
            this.attr({opacity: 1});
            this.sizer.attr({opacity: 1});
        };

        that._rstart = function () {
            this.ox = this.attr("x");
            this.oy = this.attr("y");

            this.box.ow = this.box.attr("width");
            this.box.oh = this.box.attr("height");
        };

        that._rmove = function (dx, dy) {
            // move will be called with dx and dy
            this.attr({x: this.ox + dx, y: this.oy + dy});
            this.box.attr({width: this.box.ow + dx, height: this.box.oh + dy});
        };

    },
    deleteImage: function (layer) {
        if (this._layers[layer].sizer !== undefined) {
            this._layers[layer].sizer.remove();
        }

        this._layers[layer].remove();
        this._layers[layer] = undefined;
    },
    setImage: function (layer, url, x, y, ratio) {

        console.log(layer, this._layers[layer]);

        if (this._layers[layer] !== undefined) {
            r = this._layers[layer];
            r.node.href.baseVal = url;
            
            if (!r.poppable) {
                r.toBack();
            } else {
                r.toFront();
            }
            return;
        }

        if (ratio === undefined) {
            ratio = Math.round(Math.random(0, 1), 2);
        }

        if (x == undefined) {
            x = 0;
        }

        if (y == undefined) {
            y = 0;
        }

        var image = new Image();
        image.src = url;
        var that = this;

        image.onload = function () {

            var landscape = (this.width >  this.height);
            var max_h = that.element.height();
            var max_w = that.element.width();
            
            if (landscape) {
                ratio = ratio * (max_h / this.height);
            } else {
                ratio = ratio * (max_w / this.width);
            }
            
            var h = ratio * this.height;
            var w = ratio * this.width;
            
            r = that._paper.image(url, x, y, w, h).attr({
                stroke: "none",
                cursor: "move"
            });

            r.drag(that._move, that._start, that._up);
            r.poppable = (layer[0] != '@');

            console.log(this.src, layer, r.poppable)


            if (!r.poppable) {
                r.toBack();
            } else {
                s = that._paper.image('/assets/js/images/resize.svg', x + w - 20, y + h - 20, 20, 20).attr({
                    fill: "hsb(.8, .5, .5)",
                    stroke: "none",
                    opacity: .5
                });

                r.sizer = s;

                s.drag(that._rmove, that._rstart);
                s.box = r;

                r.toFront();
                s.toFront();
            }


            that._layers[layer] = r;
        };
    }
});

