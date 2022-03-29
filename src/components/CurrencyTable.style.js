import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  historyCell: {
    color: "rgba(255,255,255, 0.5)",
    borderBottom: 1,
    borderBottomColor: "rgba(255,255,255, 0.2)",
    borderBottomStyle: 'solid'
  },
  historyDiffCell: {
    borderBottom: 1,
    borderBottomColor: "rgba(255,255,255, 0.2)",
    borderBottomStyle: 'solid'
  }
});

export default useStyles