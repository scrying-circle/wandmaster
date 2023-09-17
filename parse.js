const fs = require('fs').promises;
class Spell {
    constructor(name = "", sprite = "", type = "") {
        this.name = name;
        this.sprite = sprite;
        this.type = type;
    }
}
module.exports = {
    getSpellList: async function (dir) {
        function checkNextOpaqueToken(tokens, i) {
            for (let j = i + 1; j < tokens.length; j++) {
                if (tokens[j].length > 1 || tokens[j] == "=") {
                    return [tokens[j], j];
                }
            }
            return ["None", -1];
        }
        const spell_list = await fs.readFile(dir, { encoding: 'utf-8' }).then(data => {
            const tokens = data.split(/(\s)/);
            const detail_type = ["id", "sprite", "type"]
            const spell_properties = ["name", "sprite", "type"]
            let spell_dict = {};
            let state = 0;
            let current_spell = new Spell();
            let detail = ""
            for (let i = 0; i < tokens.length; i++) {
                if (tokens[i] == detail_type[state]) {
                    const nextToken = checkNextOpaqueToken(tokens, i + 1);
                    if (nextToken[0] == "=") {
                        let detail = checkNextOpaqueToken(tokens, nextToken[1] + 1)[0];
                        if (state != 2) {
                            detail = detail.slice(1, -2);
                        } else {
                            detail = detail.slice(0, -1);
                        }
                        current_spell[spell_properties[state]] = detail;
                        state = (state + 1) % detail_type.length;
                        if (state == 0) {
                            spell_dict[current_spell.name] = current_spell;
                            current_spell = new Spell();
                        }
                    }

                }
            }
            return spell_dict;
        }).catch(err => {
            console.log(err);
        });
        return spell_list;
    },
    displayArguments: function (message, spell_list, spell_names) {
        function addMultiplier(spells, i, multiplier) {
            if (i == 0) {
                message.channel.send("Multiplier must be preceded by a spell!");
                return;
            }
            const amount = parseInt(multiplier) - 1;
            if (isNaN(amount)) {
                message.channel.send("Multiplier must be a number!");
                return;
            }
            for (let j = 0; j < amount; j++) {
                addSpell(spells, spells, i - 1);
            }
        }
        function addSpell(arguments, spells, i) {
            if (arguments[i][0] == "X") {
                addMultiplier(arguments, i, arguments[i].slice(1));
            } else if (arguments[i] in spell_names) {
                spells.push(spell_names[arguments[i]]);
            } else if (arguments[i] in spell_list) {
                spells.push(arguments[i]);
            } else {
                message.channel.send("Spell " + arguments[i] + " not found!");
                return;
            }
        }
        const content = message.content.toUpperCase().slice(9);
        const arguments = content.split(' ');
        let spells = [];
        for (let i = 0; i < arguments.length; i++) {
            addSpell(arguments, spells, i);
        }
        return spells;
    }
}