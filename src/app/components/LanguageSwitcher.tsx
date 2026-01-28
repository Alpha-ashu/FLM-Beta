import { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  Language as LanguageIcon,
  Check,
} from '@mui/icons-material';
import { useLanguage, languageNames, Language } from '@/app/contexts/LanguageContext';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        color="inherit"
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.2)',
          },
        }}
      >
        <LanguageIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
          },
        }}
      >
        <Typography
          variant="caption"
          sx={{
            px: 2,
            py: 1,
            display: 'block',
            color: 'text.secondary',
            fontWeight: 600,
          }}
        >
          Select Language
        </Typography>
        
        {(Object.keys(languageNames) as Language[]).map((lang) => (
          <MenuItem
            key={lang}
            onClick={() => handleLanguageSelect(lang)}
            selected={language === lang}
          >
            {language === lang && (
              <ListItemIcon>
                <Check fontSize="small" />
              </ListItemIcon>
            )}
            <ListItemText
              inset={language !== lang}
              primary={languageNames[lang]}
              primaryTypographyProps={{
                fontWeight: language === lang ? 600 : 400,
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
