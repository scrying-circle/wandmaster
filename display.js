const { createCanvas, loadImage } = require('canvas');
const parse = require('./parse.js');
module.exports = {
    send: function (message, spells, spell_list) {
        const spellTypes = {
            "ACTION_TYPE_PROJECTILE": "data/ui_gfx/inventory/item_bg_projectile.png",
            "ACTION_TYPE_MODIFIER": "data/ui_gfx/inventory/item_bg_modifier.png",
            "ACTION_TYPE_DRAW_MANY": "data/ui_gfx/inventory/item_bg_draw_many.png",
            "ACTION_TYPE_MATERIAL": "data/ui_gfx/inventory/item_bg_material.png",
            "ACTION_TYPE_STATIC_PROJECTILE": "data/ui_gfx/inventory/item_bg_static_projectile.png",
            "ACTION_TYPE_OTHER": "data/ui_gfx/inventory/item_bg_other.png",
            "ACTION_TYPE_PASSIVE": "data/ui_gfx/inventory/item_bg_passive.png",
            "ACTION_TYPE_UTILITY": "data/ui_gfx/inventory/item_bg_utility.png"
        }

        const scale = 2
        const spells_per_row = 10;
        const spell_x = 20 * scale;
        const spell_y = 20 * scale;
        const spell_margin = 2 * scale;

        const canvas_width = Math.min(spell_x * spells.length, spell_y * spells_per_row);
        const canvas_height = Math.ceil(spells.length / spells_per_row) * spell_y;
        const canvas = createCanvas(canvas_width, canvas_height);
        const ctx = canvas.getContext('2d');


        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < spells.length; i++) {
            let x = (i % spells_per_row) * spell_x;
            let y = Math.floor(i / spells_per_row) * spell_y;
            loadImage("data/ui_gfx/inventory/full_inventory_box.png").then(image => {
                ctx.drawImage(image, x, y, spell_x, spell_y);
            })
            let spellToDraw = spell_list[spells[i]];
            const typeImage = spellTypes[spellToDraw.type];
            loadImage(typeImage).then(image => {
                ctx.drawImage(image, x, y, spell_x, spell_y);
            })
            loadImage(spellToDraw.sprite).then(image => {
                ctx.drawImage(image, x + spell_margin, y + spell_margin, spell_x - 2 * spell_margin, spell_y - 2 * spell_margin);
            })
        }
        function sendMessage() {
            message.channel.send({ files: [canvas.toBuffer()] });
        }
        setTimeout(sendMessage, 100);
    }
}