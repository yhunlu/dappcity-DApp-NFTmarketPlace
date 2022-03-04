import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import axios from 'axios';
import { nftaddress, nftmarketaddress } from '../config';
import { toast } from 'react-toastify';

import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';

const CreatorDashboard = () => {
  const [nfts, setNfts] = useState([]);
  const [sold, setSold] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const marketContract = new ethers.Contract(
        nftmarketaddress,
        Market.abi,
        signer
      );
      const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
      // call function from smart-contract for your specific page.
      const data = await marketContract.fetchItemsListed();

      const items = await Promise.all(
        data.map(async (i) => {
          const tokenUri = await tokenContract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenUri);
          let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
          let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            sold: i.sold,
          };
          return item;
        })
      );

      const soldItems = items.filter((i) => i.sold);
      setSold(soldItems);
      setNfts(items);
      setLoadingState('loaded');
    } catch (error) {
      toast.error(error.message);
    }
  }

  if (loadingState === 'loaded' && !nfts.length)
    return (
      <h1 className="px-20 py-10 text-3xl">
        No NFT created to show in the Dashboard.
      </h1>
    );

  return (
    <div className="justify-center">
      <div className="p-4">
        {nfts.length > 0 && (
          <h2 className="text-2xl py-2 font-bold bg-purple-100 text-center shadow-xl text-purple-900">
            Items Created
          </h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <div
              key={i}
              className="border shadow-lg rounded-xl overflow-hidden mx-auto my-auto"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={nft.image} className="rounded" alt={nft.title} />
              <div className="bg-purple-900">
                <p className="text-white font-bold text-center text-2xl">
                  PRODUCT PRICE
                </p>
                <div className="p-4 bg-white">
                  <p className="text-2xl font-bold text-purple-900 text-center">
                    <strong className="text-purple-500">
                      {nft.price} Matic
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4">
        {Boolean(sold.length) && (
          <div>
            <h2 className="text-2xl py-2 font-bold bg-purple-100 text-center shadow-xl text-purple-900">
              Items Sold
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              {sold.map((nft, i) => (
                <div
                  key={i}
                  className="border shadow-lg rounded-xl overflow-hidden mx-auto my-auto"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={nft.image} className="rounded" alt={nft.title} />
                  <div className="bg-purple-500">
                    <p className="text-pink-300 font-bold text-center text-2xl">
                      SOLD PRICE
                    </p>
                    <div className="p-4 bg-white">
                      <p className="text-2xl font-bold text-center">
                        <strong className="text-purple-900">
                          {nft.price} Matic
                        </strong>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorDashboard;
