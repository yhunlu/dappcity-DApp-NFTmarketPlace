import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import axios from 'axios';
import Web3Modal from 'web3modal';

import { nftaddress, marketplaceAddress } from '../config';

import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';

export default function ResellNFT() {
  const [formInput, updateFormInput] = useState({ price: '', image: '' });
  const router = useRouter();
  const { id, tokenURI } = router.query;
  const { image, price } = formInput;

    useEffect(() => {
      fetchNFT()
    }, [id])

  async function fetchNFT() {
    if (!tokenURI) return;
    const meta = await axios.get(tokenURI);
    updateFormInput((state) => ({ ...state, image: meta.data.image }));
  }

  async function listNFTForSale() {
    if (!price) return;
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const priceFormatted = ethers.utils.parseUnits(formInput.price, 'ether');
    let contract = new ethers.Contract(marketplaceAddress, Market.abi, signer);
    let listingPrice = await contract.getListingPrice();

    listingPrice = listingPrice.toString();
    let transaction = await contract.resellToken(
      nftaddress,
      id,
      priceFormatted,
      { value: listingPrice }
    );
    await transaction.wait();

    router.push('/');
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="rounded mx-auto my-auto"
            src={image}
            alt="selected-img"
          />
        )}
        <button
          onClick={listNFTForSale}
          className="mt-4 w-full bg-purple-500 text-white font-bold py-2 px-12 rounded"
        >
          Resell
        </button>
      </div>
    </div>
  );
}
