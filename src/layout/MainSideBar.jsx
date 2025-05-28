import React, { useContext } from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Home as HomeIcon,
  AccountBalanceWallet as WalletIcon,
  Assessment as GraphIcon,
  ListAlt as TransactionsIcon,
  Settings as SettingsIcon,
  WarningAmber as AlertIcon,
} from '@mui/icons-material';

import ToggleMode from '../components/button/ToggleMode';
import { ThemeContext } from '../context/theme';

const menuItems = [
  { text: 'Dashboard', icon: <HomeIcon />, path: '/' },
  { text: 'Trace Wallet', icon: <WalletIcon />, path: '/trace-wallets' },
  { text: 'Wallet Graph', icon: <GraphIcon />, path: '/wallet-graph' },
  { text: 'Transactions', icon: <TransactionsIcon />, path: '/transactions' },
  { text: 'Alerts', icon: <AlertIcon />, path: '/alerts' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

const MainSideBar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        height: '100vh',
        fontFamily: 'IBM Plex Sans JP, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>
        BlockTrace
      </Box>

      {/* Menu */}
      <List>
        {menuItems.map(({ text, icon, path }) => (
          <ListItem
            key={text}
            button
            onClick={() => navigate(path)}
            sx={{
              mb: 1,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              '&:hover': {
                bgcolor: '#333',
              },
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.text.primary }}>
              {icon}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ bgcolor: theme.palette.divider }} />

      {/* Footer: Toggle Dark/Light */}
      <Box
    sx={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      px: 2,
      py: 3,
      borderTop: `1px solid ${theme.palette.divider}`,
      bgcolor: theme.palette.background.paper,
    }}
  >
        <ToggleMode isDark={isDark} toggleTheme={toggleTheme} />
      </Box>
    </Box>
  );
};

export default MainSideBar;
