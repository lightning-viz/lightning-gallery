'use strict';

var LightningVisualization = require('lightning-visualization');
var ImageViz = require('lightning-image');
var _ = require('lodash');
var $ = require('jquery');
var fs = require('fs');
var css = fs.readFileSync(__dirname + '/style.css');
var template = _.template(fs.readFileSync(__dirname + '/templates/index.html'));
var utils = require('lightning-client-utils');

/*
 * Extend the base visualization object
 */
var Visualization = LightningVisualization.extend({

    currentImage: 0,

    init: function() {
        this.images = this.images.map(utils.cleanImageURL);
        this.$el = $(this.el);
        this.render();
    },

    css: css,

    render: function() {

        var markup = template({        
            images: this.images,
            utils: utils,
            currentImage: this.currentImage
        });

        this.$el.html(markup);
        var self = this;

        this.$el.find('.gallery-thumbnail').unbind().click(function() {
            self.setImage(self.$el.find('.gallery-thumbnail').index(this));
        });

        this.imageViz = new ImageViz(this.selector + ' .image-container', [], [this.images[0]], {width: this.width || 400});

        this.imageViz.on('image:loaded', function() {
            self.emit('image:loaded');
        });

    },

    formatData: function(data) {
        return data;
    },

    addImage: function(image) {
        this.images.push(image);
        this.$el.find('.gallery-container').append('<div class="gallery-thumbnail"><img src="' + imageData + '_small" /></div>');
    },

    setImage: function(index) {
        this.imageViz.setImage(this.images[index]);
    },

    updateData: function(formattedData) {
        this.images = formattedData;
        this.render();
    },

    appendData: function(formattedData) {
        if(_.isArray(formattedData)) {
            _.each(formattedData, function(image) {
                this.addImage(image);        
            });
        } else {
            this.addImage(formattedData);
        }
    }

});


module.exports = Visualization;
