import * as React from 'react';
import { Box, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip } from '@mui/material';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { createData } from '../utils';
import CurrencyAPI from '../api/CurrencyAPI';
import useStyles from "./CurrencyTable.style";
import 'datejs';

function Row(props) {
  const classes = useStyles();
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [history, setHistory] = React.useState([])

  const loadHistoryTable = (name) => {
    if (open) {
      setOpen(false)
      return
    }

    CurrencyAPI.fetchPreviousUrl()
      .then((previousURL) => CurrencyAPI.fetchPreviousData(name, previousURL, [], 10))
      .then((data) => {
        setHistory(createData(data))
        setOpen(true)
      })
  }

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} onClick={() => loadHistoryTable(row.currencyCode)}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            color="info"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={{color: "rgba(255,255,255, 0.5)"}} scope="row">
        <Tooltip title={row.currencyName} placement="bottom-start" arrow>
            <div>{row.currencyCode}</div>
        </Tooltip>
        </TableCell>
        <TableCell sx={{color: "rgba(255,255,255, 0.5)"}} align="right">{row.value}</TableCell>
        <TableCell sx={{color: row.diff >= 0 ? "rgba(99, 173, 131, 1)" : "rgba(173, 99, 121, 1)"}} align="right">{
          row.diff
        }</TableCell>
      </TableRow>
      <TableRow sx={{backgroundColor: "rgba(56,61,69, 0.8)"}}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="history">
                <TableBody>
                  {history.map((historyRow, index) => (
                    <TableRow key={index}>
                      <TableCell className={classes.historyCell} align="center">{historyRow.date.toString("d/M/yyyy")}</TableCell>
                      <TableCell className={classes.historyCell} align="center">{historyRow.value}</TableCell>
                      <TableCell className={classes.historyDiffCell} 
                        sx={{color: historyRow.diff >= 0 ? "rgba(99, 173, 131, 1)" : "rgba(173, 99, 121, 1)"}} align="right">{
                          historyRow.diff
                      }</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function CurrencyTable() {

  const [currencies, setCurrencies] = React.useState([])

  const rows = createData(Object.values(currencies))

  React.useEffect(() => {
    CurrencyAPI.fetchCurrencyData().then((data) => {
      setCurrencies(data)
    })
  }, [])
  
  return (
    <TableContainer component={Paper} sx={{
      backgroundColor: "transparent",
      width: 500,
      "& th": {
        fontSize: "1rem",
        color: "rgba(255,255,255, 0.8)",
        borderBottom: 2,
      }
      }}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Код</TableCell>
            <TableCell align="right">Курс</TableCell>
            <TableCell align="right">Разница, %</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <Row key={index} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
