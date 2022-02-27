import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { HiMenuAlt4 } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';

import logo from '../asset/logo.png';

const navtitles = [
  'Home',
  'Sell Digital Asset',
  'My Digital Assets',
  'Creator Dashboard',
];

const NavbarItem = ({ title, classProps }) => {
  return (
    <li className={`mx-10 cursor-pointer ${classProps}`}>
      <Link
        href={
          (title === 'Home')
            ? '/'
            : (title === 'Sell Digital Asset')
            ? '/create-item'
            : (title === 'My Digital Assets')
            ? '/my-assets'
            : (title === 'Creator Dashboard')
            ? '/creator-dashboard'
            : '/404'
        }
      >
        {title}
      </Link>
    </li>
  );
};

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-4">
      <div className="md:flex-[0.5] flex-initial justify-center items-center text-purple-500 text-lg mr-40">
        <Link href="/" passHref>
          <Image src={logo} alt="logo" className="w-32 cursor-pointer" />
        </Link>
      </div>
      <ul className="text-purple-500 md:flex hidden list-none flex-row justify-between items-center flex-initial">
        {navtitles.map((item, index) => (
          <NavbarItem key={item + index} title={item} />
        ))}
      </ul>
      <div className="flex relative">
        {toggleMenu ? (
          <AiOutlineClose
            fontSize={28}
            className="text-purple-500 md:hidden cursor-pointer"
            onClick={() => setToggleMenu(false)}
          />
        ) : (
          <HiMenuAlt4
            fontSize={28}
            className="text-purple-500 md:hidden cursor-pointer"
            onClick={() => setToggleMenu(true)}
          />
        )}
        {toggleMenu && (
          <ul className="z-10 fixed top-0  -left-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none flex flex-col justify-start items-end rounded-md white-glassmorphism text-purple-500 animate-slide-in">
            <li className="text-xl w-full my-2">
              <AiOutlineClose onClick={() => setToggleMenu(false)} />
            </li>
            {navtitles.map((item, index) => (
              <NavbarItem
                key={item + index}
                title={item}
                classProps="my-2 text-lg"
              />
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
