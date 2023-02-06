import { useState } from 'react'
import Web3 from 'web3'
import Web3Modal from 'web3modal'
import { create } from 'ipfs-http-client'
import { useRouter } from 'next/router'

import DragonSlayerNFT from '../../contracts/ethereum-contracts/DragonSlayer.json'
import Marketplace from '../../contracts/ethereum-contracts/Marketplace.json'

// infura endpoint config
const projectId = process.env.NEXT_PUBLIC_IPFS_PROJECT_ID
const projectSecret = process.env.NEXT_PUBLIC_IPFS_API_KEY
const host = process.env.NEXT_PUBLIC_IPFS_API_ENDPOINT
const auth =
  'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null)
  const [fileName, setfileName] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()

  async function onChange(e) {

    /* Prevent form from submitting by default */
    e.preventDefault();

    const fileName = e.target.files[0]
    setfileName(fileName)

    // ipfs send  authorization headers
    const client = create({
      host: 'infura-ipfs.io',
      port: 5001,
      protocol: 'https',
      apiPath: '/api/v0',
      headers: {
        authorization: auth
      }
    })

    // upload image to IPFS
    try {
      const added = await client.add(
        fileName,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://infura-ipfs.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  async function uploadToIPFS() {
    const { name, description, price } = formInput
    // ipfs send  authorization headers
    const client = create({
      host: 'infura-ipfs.io',
      port: 5001,
      protocol: 'https',
      apiPath: '/api/v0',
      headers: {
        authorization: auth
      }
    })    

    if (!name || !description || !price || !fileUrl) {
      return
    } else {
      // first, upload metadata to IPFS
      const data = JSON.stringify({
        name, description, image: fileUrl
      })
      try {
        const added = await client.add(data)
        const url = `https://infura-ipfs.io/ipfs/${added.path}`
        setFileUrl(url)
        // after metadata is uploaded to IPFS, return the URL to use it in the transaction
        return url
      } catch (error) {
        console.log('Error uploading file: ', error)
      }
    }
  }

  async function listNFTForSale() {
    const web3Modal = new Web3Modal()
    const provider = await web3Modal.connect()
    const web3 = new Web3(provider)
    const url = await uploadToIPFS()
    const networkId = await web3.eth.net.getId()

    // Mint the NFT
    const dragonSlayersContractAddress = DragonSlayerNFT.networks[networkId].address
    const dragonSlayersContract = new web3.eth.Contract(DragonSlayerNFT.abi, dragonSlayersContractAddress)
    const accounts = await web3.eth.getAccounts()
    const marketPlaceContract = new web3.eth.Contract(Marketplace.abi, Marketplace.networks[networkId].address)
    let listingFee = await marketPlaceContract.methods.getListingFee().call()
    listingFee = listingFee.toString()
    dragonSlayersContract.methods.safeMint(url).send({ from: accounts[0] }).on('receipt', function (receipt) {
      console.log('minted');
      // List the NFT
      const tokenId = receipt.events.NFTMinted.returnValues[0];
      marketPlaceContract.methods.listNft(dragonSlayersContractAddress, tokenId, Web3.utils.toWei(formInput.price, "ether"))
        .send({ from: accounts[0], value: listingFee }).on('receipt', function () {
          console.log('listed')
          router.push('/')
        });
    });
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={onChange}
        />
        {
          fileUrl && (
            <img className="rounded mt-4" width="350" src={fileUrl} />
          )
        }
        <button onClick={listNFTForSale} className="h-10 px-6 font-semibold rounded-full bg-violet-600 text-white">
          Mint and List NFT
        </button>
      </div>
    </div>
  )
}