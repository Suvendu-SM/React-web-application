import * as React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    root: {
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "white"
        }
    }
});

export default function Calendar({ setDateFun }) {
    const [value, setValue] = React.useState(new Date());

    const classes = useStyles();

    const handleChange = (newValue) => {
        setValue(newValue);

        let date = newValue.getDate()
        let month = newValue.getMonth()
        let year = newValue.getFullYear()

        date = date < 10 ? '0' + date : date
        month = month < 10 ? '0' + month : month

        const newdate = year + '-' + month + '-' + date

        setDateFun(newdate)
    };

    const color = '#fff'
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={0}>
                <DesktopDatePicker
                    label="Date desktop"
                    inputFormat="yyyy/MM/dd"
                    value={value}
                    onChange={handleChange}
                    renderInput={(params) => <TextField className={classes.root}
                        {...params} sx={{
                            svg: { color },
                            input: { color },
                            label: { color }
                        }} />}
                />
            </Stack>
        </LocalizationProvider>
    );
}
