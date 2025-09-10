import React from 'react';
import { motion } from 'motion/react';
import { AuroraText } from "@/components/magicui/aurora-text";

const Header = ({ author }) => (
  <motion.div className="bg-[#0A0A0A] text-white p-4"
    initial={{
      y: -80
    }}
    animate={{
      y: 0
    }}
    transition={{
      duration: .5
    }}
  >
    <h1 className="text-4xl font-bold">
      <AuroraText>Document Summary Assistant</AuroraText>
      <span className="text-[1rem] text-white/70 font-normal ml-2">by {author}</span>
    </h1>
  </motion.div >
);

export default Header;