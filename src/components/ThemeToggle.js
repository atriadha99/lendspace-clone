// src/ThemeToggle.js
import React from 'react';
import { useColorMode, IconButton } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

function ThemeToggle() {
  // 1. Hook bawaan Chakra untuk mengelola dark/light mode
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label="Toggle theme"
      // 2. Tampilkan ikon yang sesuai
      icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
      // 3. Panggil fungsi toggle saat diklik
      onClick={toggleColorMode}
    />
  );
}

export default ThemeToggle;