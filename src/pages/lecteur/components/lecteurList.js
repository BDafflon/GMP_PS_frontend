import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import SearchIcon from '@mui/icons-material/Search';
import * as UserManager from "../../../utils/usersManager";
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { updateUser } from "../../../utils/usersManager";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
    
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "lastname",
    numeric: false,
    disablePadding: true,
    label: "Nom"
  },
  {
    id: "firstname",
    numeric: false,
    disablePadding: true,
    label: "Prenom"
  },
  {
    id: "mail",
    numeric: false,
    disablePadding: false,
    label: "Mail"
  },
  {
    id: "relecture",
    numeric: true,
    disablePadding: false,
    label: "Relectures"
  },
  {
    id: "permission",
    numeric: false,
    disablePadding: false,
    label: "Permission"
  },
  {
    id: "rank",
    numeric: true,
    disablePadding: false,
    label: "Admin"
  },
  {
    id: "detail",
    numeric: false,
    disablePadding: false,
    label: "Detail"
  },
  
];

const DEFAULT_ORDER = "asc";
const DEFAULT_ORDER_BY = "calories";
const DEFAULT_ROWS_PER_PAGE = 100;

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort
  } = props;
  const createSortHandler = (newOrderBy) => (event) => {
    onRequestSort(event, newOrderBy);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts"
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="left"
            padding="none"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
           
        })
      }}
    >
      {numSelected > 0 ? (
         <Typography
         sx={{ flex: "1 1 100%" }}
         variant="h6"
         id="tableTitle"
         component="div"
       >
           Lecteurs({numSelected})
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          lecteurs
        </Typography>
      )}

      
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired
};

 
function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export default function LecteurList({token , lecteurs,setSelectedLecteurForAction,udpater,forceUpdate}) {
  const [selectedLecteur,setSelectedLecteur]=React.useState([]);
  const [order, setOrder] = React.useState(DEFAULT_ORDER);
  const [orderBy, setOrderBy] = React.useState(DEFAULT_ORDER_BY);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(0);
  const [visibleRows, setVisibleRows] = React.useState(null);
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE);
  const [paddingHeight, setPaddingHeight] = React.useState(0);
  const [detailUser,setDetailUser] = React.useState(null);
  const [openModal,setOpenModal]= React.useState(false);
  const [newMDP,setMDP]= React.useState(makeid(10));

  React.useEffect(() => {
    
    
    setSelectedLecteur(lecteurs)
     

    let rowsOnMount = stableSort(
      lecteurs,
      getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY)
    );

    rowsOnMount = rowsOnMount.slice(
      0 * DEFAULT_ROWS_PER_PAGE,
      0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE
    );

    setVisibleRows(rowsOnMount);
  }, [lecteurs,udpater]);

  const handleRequestSort = React.useCallback(
    (event, newOrderBy) => {
      const isAsc = orderBy === newOrderBy && order === "asc";
      const toggledOrder = isAsc ? "desc" : "asc";
      setOrder(toggledOrder);
      setOrderBy(newOrderBy);

      const sortedRows = stableSort(
        lecteurs,
        getComparator(toggledOrder, newOrderBy)
      );
      const updatedRows = sortedRows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );

      setVisibleRows(updatedRows);
    },
    [order, orderBy, page, rowsPerPage]
  );

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = lecteurs.map((n) => n.id);
      setSelected(newSelected);
      setSelectedLecteurForAction(newSelected)

      return;
    }
    setSelected([]);
    setSelectedLecteurForAction([])

  };

  const handleClick = (event, nom) => {

    const selectedIndex = selected.indexOf(nom.id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, nom.id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
    setSelectedLecteurForAction(newSelected)
   };

  const handleChangePage = React.useCallback(
    (event, newPage) => {
      setPage(newPage);

      const sortedRows = stableSort(lecteurs, getComparator(order, orderBy));
      const updatedRows = sortedRows.slice(
        newPage * rowsPerPage,
        newPage * rowsPerPage + rowsPerPage
      );

      setVisibleRows(updatedRows);

      // Avoid a layout jump when reaching the last page with empty rows.
      const numEmptyRows =
        newPage > 0
          ? Math.max(0, (1 + newPage) * rowsPerPage - lecteurs.length)
          : 0;

      const newPaddingHeight = (dense ? 33 : 53) * numEmptyRows;
      setPaddingHeight(newPaddingHeight);
    },
    [order, orderBy, dense, rowsPerPage]
  );

  const handleChangeRowsPerPage = React.useCallback(
    (event) => {
      const updatedRowsPerPage = parseInt(event.target.value, 10);
      setRowsPerPage(updatedRowsPerPage);

      setPage(0);

      const sortedRows = stableSort(lecteurs, getComparator(order, orderBy));
      const updatedRows = sortedRows.slice(
        0 * updatedRowsPerPage,
        0 * updatedRowsPerPage + updatedRowsPerPage
      );

      setVisibleRows(updatedRows);

      // There is no layout jump to handle on the first page.
      setPaddingHeight(0);
    },
    [order, orderBy]
  );

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const formatPermission =p =>{
     let s = ""
     p.forEach(element => {
      s+=element.nom+","
     });
     s=s.slice(0,-1)
     if (s.length>10){
      s=s.slice(0,7)
      s+="..."
     }
      
    return s
    
  }

  const openDetail = user => (e)=>{
    setDetailUser(user)
    setMDP(makeid(10))
    setOpenModal(true)
  } 

  const handleAdmin = user => async (e) =>{
    console.log("admin",user,e)
    let x = UserManager.updateUser(token,user,"rank",e.target.checked?0:1)
    forceUpdate()
  }
  const handleOneUser = id =>{
    console.log("my",id)
  }

  const formatMail =m =>{
    let s = m
    
    if (s.length>10){
     s=s.slice(0,7)
     s+="..."
    }
     
   return s
   
 }

 const handleCloseAndUpdate = async()=>{
  let x = await updateUser(token, detailUser,"pwd",newMDP)

 }

 const handleCloseModal = ()=>{
  setDetailUser(null)
  setOpenModal(false)
 }

  const isSelected = (nom) => selected.indexOf(nom) !== -1;
 
  return (
    <>
    <Box sx={{ width: "100%" }}>
      
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="small"
          >
            <colgroup>
            <col width="5%" />
            <col width="10%" />
            <col width="10%" />
            <col width="15%" />
            <col width="10%" />
            <col width="20%" />
            <col width="10%" />
            <col width="10%" />
        </colgroup>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={lecteurs.length}
            />
            <TableBody>
              {visibleRows
                ? visibleRows.map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                          onClick={(event) => handleClick(event, row)}
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        > 
                          {row.lastname}
                        </TableCell>
                        <TableCell align="left">{row.firstname}</TableCell>
                        <TableCell align="left">{formatMail(row.mail)}</TableCell>
                        <TableCell align="left">{formatMail(row.relecture.length)}</TableCell>
                        <TableCell align="left">{formatPermission(row.permission)}</TableCell>
                        
                        <TableCell align="left">

                        <Switch
                              checked={row.rank==0}
                               onChange={handleAdmin(row)}
                              inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </TableCell>
                        <TableCell align="left">

                        <IconButton color="primary" aria-label="upload picture" component="label" onClick={openDetail(row)}>
                          <ZoomInIcon />
                        </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                : null}
              {paddingHeight > 0 && (
                <TableRow
                  style={{
                    height: paddingHeight
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25,50,100]}
          component="div"
          count={lecteurs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>


    <Dialog open={openModal} onClose={handleCloseModal}>
        {
          detailUser==undefined? <></> : <DialogTitle>Mise a jour du lecteur {detailUser.firstname} - {detailUser.lastname} </DialogTitle>
        }
        <DialogContent>
           
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Nouveau mot de passe"
            type="email"
            fullWidth
            onChange={e=>setMDP(e.target.value)}
            value={newMDP}
            variant="standard"
          />
             
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Annuler</Button>
          <Button onClick={handleCloseAndUpdate}>Valider</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
