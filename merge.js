const fs = require('fs')
const argv = require('minimist')(process.argv.slice(2), { string: ["_"] });
const axios = require('axios')
const FormData = require("form-data")
const child_process = require('child_process')

async function main(instructions_file) {
    if (fs.existsSync('./results/' + instructions_file) && fs.existsSync('./assets/' + instructions_file)) {
        let nfts = fs.readdirSync('./results/' + instructions_file)
        let media_files = fs.readdirSync('./assets/' + instructions_file)
        console.log('Found ' + nfts.length + ' nfts to merge')
        
        if(!fs.existsSync('./nfts')){
            fs.mkdirSync('./nfts')
        }
        if(!fs.existsSync('./nfts/' + instructions_file)){
            fs.mkdirSync('./nfts/' + instructions_file)
        }

        for (let k in nfts) {
            let nft = JSON.parse(fs.readFileSync('./results/' + instructions_file + '/' + nfts[k]).toString())
            const formData = new FormData();
            formData.append("file", fs.createReadStream('./assets/' + instructions_file + '/' + media_files[k]));
            try {
                console.log('Uploading image ' + media_files[k] + ' to IPFS...')
                let ipfs = await axios({
                    method: "post",
                    url: 'http://localhost:5001/api/v0/add?cid-version=1',
                    data: formData,
                    headers: {
                        "Content-Type": "multipart/form-data; boundary = " + formData._boundary
                    }
                })
                nft.image = "https://ipfs.io/ipfs/" +ipfs.data.Hash
                console.log('Done, IPFS hash is:', ipfs.data.Hash)
                nft.external_url = nft.external_url.replace(k, ipfs.data.Hash)
                console.log('Saving NFT ' + k + '.json to disk..')
                fs.writeFileSync('./nfts/' + instructions_file + '/' + k + '.json', Buffer.from(JSON.stringify(nft)))
                console.log('Pinning image to Pinata..')
                child_process.execSync("ipfs pin remote add --service=Pinata " + ipfs.data.Hash)
                console.log('--')
            } catch (e) {
                console.log('Error while uploading media', e.message)
                console.log('--')
            }
        }
        console.log('All done, enjoy!')
    } else {
        console.log('Sorry, we need ' + instructions_file + ' folder in `assets` and `results` to complete merge.')
    }
}

if (argv._ !== undefined) {
    main(argv._)
} else {
    console.log('Please give an instruction first')
}