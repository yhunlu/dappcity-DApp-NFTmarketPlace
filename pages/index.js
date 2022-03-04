import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Web3Modal from 'web3modal';
import { nftaddress, nftmarketaddress } from './../config';
import { toast } from 'react-toastify';

import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';

const Home = () => {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');

  async function loadNFTs() {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        'https://rpc-mumbai.maticvigil.com/'
      );
      const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
      const marketContract = new ethers.Contract(
        nftmarketaddress,
        Market.abi,
        provider
      );
      const data = await marketContract.fetchMarketItems();

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
            name: meta.data.name,
            description: meta.data.description,
          };
          return item;
        })
      );
      setNfts(items);
      setLoadingState('loaded');
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function buyNft(nft) {
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);

      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        nftmarketaddress,
        Market.abi,
        signer
      );

      const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');

      const transaction = await contract.createMarketSale(
        nftaddress,
        nft.tokenId,
        {
          value: price,
        }
      );

      await transaction.wait();
      loadNFTs();
      // toast.info('You have successfully purchased this item.');
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    loadNFTs();
  }, []);

  if (loadingState === 'loaded' && !nfts.length)
    return <h1 className="px-20 py-10 text-3xl">No items in Market Place.</h1>;

  return (
    <div>
      <Head className="container mx-auto px-10 mb-8">
        <title>DappCity MarketPlace</title>
        <link rel="icon" href="/logo-tab.png" />
      </Head>
      <div className="flex justify-center">
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {nfts?.map((nft, i) => (
              <div
                key={i}
                className="my-auto border shadow-2xl rounded-xl overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="rounded mx-auto my-auto"
                  src={nft.image}
                  alt={nft.title}
                />
                <div className="p-4">
                  <p
                    style={{ height: '64px' }}
                    className="text-2xl font-semibold text-center"
                  >
                    {nft.name}
                  </p>
                  <div style={{ height: '70px', overflow: 'hidden' }}>
                    <p className="text-gray-400 text-center">
                      {nft.description}
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white text-center">
                    {nft.price} Matic
                  </p>
                  <button
                    className="mt-4 w-full bg-purple-500 text-white font-bold py-2 px-12 rounded"
                    onClick={() => buyNft(nft)}
                  >
                    Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
