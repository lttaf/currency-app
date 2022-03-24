import * as React from 'react';
import { Box, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip } from '@mui/material';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { getPercentDiff } from '../utils';
import CurrencyAPI from '../api/CurrencyAPI';
import useStyles from "./CurrencyTable.style";

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
        setHistory(data)
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
        <Tooltip title={row.currencyName} placement="left" arrow>
          <TableCell sx={{color: "rgba(255,255,255, 0.5)"}} scope="row">
            {row.currencyCode}
          </TableCell>
        </Tooltip>
        <TableCell sx={{color: "rgba(255,255,255, 0.5)"}} align="right">{row.rate}</TableCell>
        <TableCell sx={{color: "rgba(255,255,255, 0.5)"}} align="right">{row.diff}</TableCell>
      </TableRow>
      <TableRow sx={{backgroundColor: "rgba(56,61,69, 0.8)"}}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="history">
                <TableBody>
                  {history.map((historyRow, index) => (
                    <TableRow key={index}>
                      <TableCell className={classes.historyCell} align="center">{historyRow.Date}</TableCell>
                      <TableCell className={classes.historyCell} align="center">{historyRow.Value}</TableCell>
                      <TableCell className={classes.historyCell} align="right">{
                        getPercentDiff(historyRow.Value, historyRow.Previous).toFixed(2)
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

  const rows = Object.values(currencies).map(item => {
    const diff = getPercentDiff(item.Value, item.Previous)
    return {
      currencyCode: item.CharCode,
      currencyName: item.Name,
      rate: item.Value,
      diff: diff.toFixed(2)
    };
  })

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
