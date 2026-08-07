import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    shape: {
        borderRadius: 8, 
    },
    components: {
        MuiDialog: {
        styleOverrides: {
            paper: {
            borderRadius: 16,
            padding: '8px',
            boxShadow: '0px 10px 40px rgba(0,0,0,0.1)',
            },
        },
        },
        MuiDialogContent: {
        styleOverrides: {
            root: {
            paddingTop: '24px !important',
            },
        },
        },
        MuiButton: {
        styleOverrides: {
            root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
            padding: '8px 16px',
            },
        },
        defaultProps: {
            disableElevation: true,
        },
        },
        MuiOutlinedInput: {
        styleOverrides: {
            root: {
            borderRadius: 10,
            },
        },
        },
    },
});