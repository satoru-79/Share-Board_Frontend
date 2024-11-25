import { Alert, Tooltip } from '@mui/material';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react';
import { lightGreen } from '@mui/material/colors';


type Props = {
    value : string
}


//クリップボードへのコピー機能コンポーネント
const CopyToClipboard:React.FC<Props> = (props) => {

    const copyBoardKey: () => Promise<void> = async () => {
        await global.navigator.clipboard.writeText(props.value);
        setOpen(true)
    };

    const [open, setOpen] = React.useState(false);


    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
        return;
        }

        setOpen(false);
    };

    const action = (
        <React.Fragment>
        <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
        >
            <CloseIcon fontSize="small" />
        </IconButton>
        </React.Fragment>
    );

    return (
        <div className='h-full flex items-center'>
            <Tooltip title="コピー" 
                     className='flex justify-center items-center btn absolute left-[30%]'
                     onClick={() => copyBoardKey()}
              >
                <p className='text-white font-black'
                   style={{fontSize: window.innerWidth < 850 ? 12: 16}}
                >
                  ID : {props.value}
                </p>
            </Tooltip>
            <Snackbar
                anchorOrigin={{ vertical : "bottom", horizontal : "center" }}
                open={open}
                autoHideDuration={2000}
                onClose={handleClose}
            >
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    コピーしました
                </Alert>
            </Snackbar>


        </div>    
    )

}

export default CopyToClipboard