const fs = require('fs')
const argv = require('minimist')(process.argv.slice(2), { string: ["_"] });
const Roll = require('roll')
const roll = new Roll()

async function main(instructions_file) {
    if (fs.existsSync('./instructions/' + instructions_file)) {
        if (!fs.existsSync('./results')) {
            fs.mkdirSync('./results')
        }
        if (!fs.existsSync('./results/' + instructions_file)) {
            fs.mkdirSync('./results/' + instructions_file)
        }

        const instructions = fs.readFileSync('./instructions/' + instructions_file).toString().split("\n")
        console.log('Found ' + instructions.length + ' instructions!')

        let to_generate = instructions[0].split(':')[1]
        let traits = []
        let found = []
        let tot_traits = 0
        for (let k in instructions) {
            if (instructions[k].indexOf('#') === 0) {
                tot_traits++
            }
        }
        console.log('Need to generate ' + to_generate + ' traits')
        let generated = fs.readdirSync('./results/' + instructions_file)
        if (generated.length < to_generate) {
            while (traits.length < tot_traits) {
                for (let k in instructions) {
                    let instruction = instructions[k]
                    let skip = false
                    if (instruction.indexOf('GENERATE') !== -1) {
                        skip = true
                    } else if (instruction.indexOf('#') === 0) {
                        skip = true
                    }

                    if (!skip) {
                        let trait_name = instruction.split('|')[1].split(':')[0].toLowerCase()
                        let attribute = instruction.split('|')[1].split(':')[1].toLowerCase()
                        let dice = instruction.split('|')[0].split('>')[0]
                        let threshold = parseInt(instruction.split('|')[0].split('>')[1])

                        if (found.indexOf(trait_name) === -1) {
                            console.log('-> TRAIT: ', trait_name)
                            console.log('-> ATTRIBUTE:', attribute)
                            console.log('--> SENDING ' + dice + ', pass if higher than ' + threshold)

                            const dice_roll = roll.roll(dice)
                            if (dice_roll.result > threshold) {
                                console.log('--> NICE SHOT! ' + dice_roll.result + ' IS ENOUGH!', dice, '>', threshold)
                                traits.push({
                                    "trait_type": trait_name,
                                    "value": attribute
                                })
                                found.push(trait_name)
                            } else {
                                console.log('--> BAD LUCK ' + dice_roll.result + ' ISN\'T ENOUGH!')
                            }
                        }
                    }
                }
            }

            fs.writeFileSync('./results/' + instructions_file + '/' + generated.length + '.json', JSON.stringify(traits))

            let next = generated.length++
            if (next <= to_generate) {
                setTimeout(function () {
                    main(instructions_file)
                }, 10)
            }
        } else {
            console.log('Generation ended!')
        }
    } else {
        console.log('Sorry, ' + instructions_file + ' not found in folder `instructions`.')
    }
}

if (argv._ !== undefined) {
    main(argv._)
} else {
    console.log('Please give an instruction first')
}