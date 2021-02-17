odoo.define("website_sale_secondary_unit.animation", function(require) {
    "use strict";

    const sAnimation = require("website.content.snippets.animation");

    sAnimation.registry.sale_secondary_unit = sAnimation.Class.extend({
        selector: ".secondary-unit",
        // eslint-disable-next-line no-unused-vars
        init: function(parent, editableMode) {
            this._super.apply(this, arguments);
            this.$secondary_uom = null;
            this.$secondary_uom_qty = null;
            this.$product_qty = null;
            this.secondary_uom_qty = null;
            this.secondary_uom_factor = null;
            this.product_uom_factor = null;
            this.product_qty = null;
        },
        start: function() {
            this.$secondary_uom = $("#secondary_uom");
            this.$secondary_uom_qty = $(".secondary-quantity");
            this.$product_qty = $(".quantity");
            this._setValues();
            this.$target.on(
                "change",
                ".secondary-quantity",
                this._onChangeSecondaryUom.bind(this)
            );
            this.$target.on(
                "change",
                "#secondary_uom",
                this._onChangeSecondaryUom.bind(this)
            );
            this.$product_qty.on("change", null, this._onChangeProductQty.bind(this));
            if (this.secondary_uom_qty) {
                this._onChangeSecondaryUom();
            }
        },
        _setValues: function() {
            this.secondary_uom_qty = Number(
                this.$target.find(".secondary-quantity").val()
            );
            this.secondary_uom_factor = Number(
                $("option:selected", this.$secondary_uom).data("secondary-uom-factor")
            );
            this.product_uom_factor = Number(
                $("option:selected", this.$secondary_uom).data("product-uom-factor")
            );
            this.product_qty = Number($(".quantity").val());
        },

        _onChangeSecondaryUom: function() {
            this._setValues();
            const factor = this.secondary_uom_factor * this.product_uom_factor;
            this.$product_qty.val(this.secondary_uom_qty * factor);
        },
        _onChangeProductQty: function() {
            this._setValues();
            const factor = this.secondary_uom_factor * this.product_uom_factor;
            this.$secondary_uom_qty.val(this.product_qty / factor);
        },
    });

    sAnimation.registry.sale_secondary_unit_cart = sAnimation.Class.extend({
        selector: ".oe_cart",
        // eslint-disable-next-line no-unused-vars
        init: function(parent, editableMode) {
            this._super.apply(this, arguments);
            this.$product_qty = null;
            this.secondary_uom_qty = null;
            this.secondary_uom_factor = null;
            this.product_uom_factor = null;
            this.product_qty = null;
        },
        start: function() {
            var _this = this;
            this.$target.on(
                "change",
                "input.js_secondary_quantity[data-line-id]",
                function() {
                    _this._onChangeSecondaryUom(this);
                }
            );
        },
        _setValues: function(order_line) {
            this.$product_qty = this.$target.find(
                ".quantity[data-line-id=" + order_line.dataset.lineId + "]"
            );
            this.secondary_uom_qty = Number(order_line.value);
            this.secondary_uom_factor = Number(order_line.dataset.secondaryUomFactor);
            this.product_uom_factor = Number(order_line.dataset.productUomFactor);
        },
        _onChangeSecondaryUom: function(order_line) {
            this._setValues(order_line);
            const factor = this.secondary_uom_factor * this.product_uom_factor;
            this.$product_qty.val(this.secondary_uom_qty * factor);
            this.$product_qty.trigger("change");
        },
    });
});
