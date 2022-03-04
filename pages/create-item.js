import { useState } from 'react';
import { ethers } from 'ethers';
import { create as ipfsClient } from 'ipfs-http-client';
import { useRouter } from 'next/router';
import Web3Modal from 'web3modal';
import { nftaddress, nftmarketaddress} from '../config';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { toast } from 'react-toastify';

import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';
import { projectId, projectSecret } from '../infuraConfig';

const auth =
  'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = ipfsClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

const Createitem = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({
    price: '',
    name: '',
    description: '',
  });
  const router = useRouter();

  async function onChange(e) {
    const file = e.target.files[0];

    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function createItem() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });

    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      // after file is uploaded to IPFS, pass the URL to save it on Polygon
      createSale(url);
      toast.info("You have successfully created this item.");
    } catch (error) {
      toast.error('Error uploading file:', error.message);
    }
  }

  async function createSale(url) {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      // create the item
      let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
      let transaction = await contract.createToken(url);
      let tx = await transaction.wait();

      let event = tx.events[0];
      let value = event.args[2];
      let tokenId = value.toNumber();

      const price = ethers.utils.parseUnits(formInput.price, 'ether');
      contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
      let listingPrice = await contract.getListingPrice();
      listingPrice = listingPrice.toString();

      transaction = await contract.createMarketItem(
        nftaddress,
        tokenId,
        price,
        {
          value: listingPrice,
        }
      );
      await transaction.wait();
      router.push('/');
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className="flex justify-center items-center flex-col border-2 border-dotted border-purple-500 p-3 w-full h-420">
            {!fileUrl ? (
              <label>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-2xl text-purple-500">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg text-purple-500">Click to upload</p>
                  </div>
                  <p className="mt-32 text-purple-500">
                    Use high-quality JPG, SVG, PNG, GIF less than 20MB
                  </p>
                </div>
                <input
                  type="file"
                  name="Asset"
                  onChange={onChange}
                  className="w-0 h-0"
                ></input>
              </label>
            ) : (
              <div className="relative h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="h-full w-full"
                  src={fileUrl}
                  alt="uploaded-nft"
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
          <input
            placeholder="Asset Name"
            type="text"
            className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2"
            onChange={(e) =>
              setFormInput({ ...formInput, name: e.target.value })
            }
          />
          <textarea
            placeholder="Asset Description"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
            onChange={(e) =>
              setFormInput({ ...formInput, description: e.target.value })
            }
          />
          <input
            placeholder="Asset Price in Matic"
            type="number"
            className="outline-none rounded number sm:text-lg mt-2 border-b-2 border-gray-200 p-2"
            onChange={(e) =>
              setFormInput({ ...formInput, price: e.target.value })
            }
          />
          <div className="flex flex-col items-center">
            <div className="flex justify-end items-end mt-5">
              <button
                type="button"
                onClick={createItem}
                className="bg-purple-500 text-white font-bold p-2 rounded-full w-60 outline-none"
              >
                Create Digital Asset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Createitem;
