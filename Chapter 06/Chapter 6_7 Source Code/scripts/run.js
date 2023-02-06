var DragonSlayerNFT = artifacts.require("DragonSlayer");
var Marketplace = artifacts.require("Marketplace");

async function logNftLists(marketplace) {
  let listedNfts = await marketplace.getListedNfts.call()
  const accountAddress = '0x0ffE7F0A22F09dCC0fCbc54ef66a01c6eE0eE201'
  let myNfts = await marketplace.getMyNfts.call({ from: accountAddress })
  let myListedNfts = await marketplace.getMyListedNfts.call({ from: accountAddress })
  console.log(`listedNfts: ${listedNfts.length}`)
  console.log(`myNfts: ${myNfts.length}`)
  console.log(`myListedNfts ${myListedNfts.length}\n`)
}

const main = async (cb) => {
  try {
    const dragonSlayer = await DragonSlayerNFT.deployed()
    const marketplace = await Marketplace.deployed()

    console.log('MINT AND LIST 3 NFTs')
    let listingFee = await marketplace.getListingFee()
    listingFee = listingFee.toString()
    console.log(`logging listingfee: ${listingFee}`)

    // minting first token
    let txn1 = await dragonSlayer.safeMint("https://api.dragonslayer.com/")
    let tokenId1 = txn1.logs[0].args['tokenId'].toNumber()
    console.log(`logging tokenId1: ${tokenId1}`)

    await marketplace.listNft(dragonSlayer.address, tokenId1, 1, { value: listingFee })
    console.log(`Minted and listed ${tokenId1}`)

    // minting second token
    let txn2 = await dragonSlayer.safeMint("https://api.dragonslayer.com/")
    let tokenId2 = txn2.logs[0].args['tokenId'].toNumber()
    console.log(`logging tokenId2: ${tokenId2}`)

    await marketplace.listNft(dragonSlayer.address, tokenId2, 1, { value: listingFee })
    console.log(`Minted and listed ${tokenId2}`)

    // minting third token
    let txn3 = await dragonSlayer.safeMint("https://api.dragonslayer.com/")
    let tokenId3 = txn3.logs[0].args['tokenId'].toNumber()
    console.log(`logging tokenId3: ${tokenId3}`)

    await marketplace.listNft(dragonSlayer.address, tokenId3, 1, { value: listingFee })
    console.log(`Minted and listed: ${tokenId3}`)
    await logNftLists(marketplace)

    console.log('BUY 2 NFTs')
    await marketplace.buyNft(dragonSlayer.address, tokenId1, {value: 1})
    await marketplace.buyNft(dragonSlayer.address, tokenId2, {value: 1})
    await logNftLists(marketplace)

    console.log('RESELL 1 NFT')
    await marketplace.resellNft(dragonSlayer.address, tokenId2, 1, {value: listingFee})
    await logNftLists(marketplace)        

  } catch (err) {
    console.log('Doh! ', err);
  }
  cb();
}

module.exports = main;
