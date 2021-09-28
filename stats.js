const fs = require('fs')
const argv = require('minimist')(process.argv.slice(2), { string: ["_"] });
const Roll = require('roll')
const roll = new Roll()

async function main(instructions_file) {
    if (fs.existsSync('./instructions/' + instructions_file)) {
        if (fs.existsSync('./results/' + instructions_file)) {
            let results = fs.readdirSync('./results/' + instructions_file)
            console.log('Found ' + results.length + ' files to evaluate')
            let counters = {}
            for (let k in results) {
                let nft = JSON.parse(fs.readFileSync('./results/' + instructions_file + '/' + results[k]))
                let traits = nft.attributes
                for (let k in traits) {
                    let trait = traits[k].trait_type
                    let attribute = traits[k].value
                    if (counters[trait] === undefined) {
                        counters[trait] = {}
                    }
                    if (counters[trait][attribute] === undefined) {
                        counters[trait][attribute] = 0
                    }
                    counters[trait][attribute]++
                }
            }
            console.log('NUMERIC RESULT:')
            console.log(counters)
            console.log('--')
            console.log('STATISTIC RESULT:')
            for (let k in Object.keys(counters)) {
                let trait = Object.keys(counters)[k]
                console.log('| ' + trait + ' | ')
                for (let j in counters[trait]) {
                    let count = counters[trait][j]
                    let percentage = 100 / results.length * count
                    console.log(j + ': ' + percentage.toFixed(2) + '%')
                }
                console.log('--')
            }
        } else {
            console.log('Nothing to evaluate.')
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