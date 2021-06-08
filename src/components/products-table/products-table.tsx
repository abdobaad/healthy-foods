import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import axios from "axios"



interface Column {
  label: string;
  name:string;
}

 /* const columns: Column[] = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
  {
    id: 'population',
    label: 'Population',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'size',
    label: 'Size\u00a0(km\u00b2)',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'density',
    label: 'Density',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toFixed(2),
  },
]; */ 

interface Data {
  id:string;
  name:string;
  tags:string | undefined;
  energy:number;
  protein:number;
  fat:number;
  carbohydrate:number;
  sugars:number;
  dietaryFibre:number;
  sodium:number
}

function createData(id:string,name:string,tags:string,energy:number,protein:number,fat:number,carbohydrate:number,sugars:number,dietaryFibre:number,sodium:number): Data {
  return {id,name,tags,energy,protein,fat,carbohydrate,sugars,dietaryFibre,sodium};
}

  


/* const useStyles = makeStyles(theme=>{
  container:{
    background: 'red';
  }
}); */
const useStyles = makeStyles({
  root: {
    backgroundColor: 'red',
    //color: props => props.color,
  },
});

const ProductsTable= (props) => {
  
  const classes = useStyles(props);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [tableColumns,setTableColumns] = React.useState<Column[]>([])
  const [tableRows,setTableRows] = React.useState([]);
  const [compareItems,setCompareItems] = React.useState([]);
  const [showDiff,setShowDiff] = React.useState(false);
  const [firstProduct,setFirstProduct] = React.useState([]);
  const [secondProduct,setSecondProduct] = React.useState([]);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const SelectedFood = (food) => {
    if(compareItems.length < 2){
      setCompareItems([...compareItems,food])
    }
  }
  const CompareFood =async () => {
    setShowDiff(true)
    setFirstProduct(tableRows.find(ele=> ele.id === compareItems[0]))
    setSecondProduct(tableRows.find(ele=> ele.id === compareItems[1]))

    console.log(firstProduct,secondProduct)
  }
  useEffect(()=>{
    const fetch = async () => {
      const rows = await axios.get('http://localhost:3000/api/products');
      const columns = await axios.get('http://localhost:3000/api/products/properties');

    //  console.log(columns)

      const rowsData = rows.data.map(({id,name,tags,nutrition:{energy,protein,fat,carbohydrate,sugars,dietaryFibre,sodium,}})=>{
      return createData(id,name,tags && tags.join(', '),energy,protein,fat,carbohydrate,sugars,dietaryFibre,sodium);  
      })
  
      setTableRows([...rowsData])
      setTableColumns([...columns.data])
    }
    fetch()
  },[])
  // TODO Feature 1: Display products in a rich text table
  // TODO Feature 2: Compare two products
  return (<div>
      <AppBar style={styles.navbar} position="static">
      
      <Toolbar style={styles.toolbar}>
        <div style={styles.toolbarLeft}>
          <IconButton style={styles.BurgerIcon} edge="start" /* className={classes.menuButton} */ color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          {compareItems.length > 0 && <Typography variant="h6" /* className={classes.title} */>
             {compareItems.length === 1 ? '1 product selected' : `${compareItems.length} products selected` }
          </Typography> }
          
        </div>
        <Button onClick={()=> CompareFood()} variant="contained" disabled={compareItems.length < 2}>
          {compareItems.length < 2 ? "select 2 products to compare" : "compare products"}
        </Button>
      </Toolbar>
    </AppBar>
    <Paper >
        <TableContainer style={styles.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {tableColumns.map((column) => (
                  <TableCell
                    key={column.name}
                    align={"center"}
                    style={{ minWidth: 170 }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
              {showDiff && <TableRow>
               
                {tableColumns.map((column) =>{
                  const value1 = firstProduct[column.name]
                  const value2 = secondProduct[column.name]
                  if(column.name === "name"){
                    return <TableCell
                    key={column.name}
                    align={"center"}
                    style={{ minWidth: 170 }}
                    >
                       <span>{value1}</span>
                      <span> vs </span>
                      <span>{value2}</span>
                    </TableCell>
                  }

                  if(column.name === 'tags'){ 
                   return( <TableCell
                    key={column.name}
                    align={"center"}
                    style={{ minWidth: 170 }}
                  >
                   <span>{value1},{value2}</span> 
                  </TableCell>) 
                  }

                 return( <TableCell
                    key={column.name}
                    align={"center"}
                    style={{ minWidth: 170 }}
                  >
                   <span>{value1 || "-"}</span>
                   <span>{value2 || "-"}</span>
                  </TableCell>)
})}
            
            
           </TableRow>}
            </TableHead>
            <TableBody>
              {tableRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                return (
                  <TableRow style={compareItems.includes(row.id) ? {backgroundColor:"#794350"} : {}} onClick={()=> SelectedFood(row.id)} hover role="checkbox" tabIndex={-1} key={row.id}>
                      {tableColumns.map((column) => {
                        
                        const value = row[column.name];                  
                        return (
                          <TableCell key={column.name} align={"center"}>
                            {value ? value : '-'}
                          </TableCell>
                        );
                      })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25,40, 100]}
          component="div"
          count={tableRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
    </Paper>
    </div>
)}

const styles = {
  container:{ 
    maxHeight: "470px",
    overflowY: "scroll",
   maxWidth: "90vw",
  },
  navbar:{
    backgroundColor:"#424242"
  },
  toolbar:{
     display:"flex",
     justifyContent:"space-between",
     alignItems:"center"
  },
  toolbarLeft:{
    display:"flex",
    alignItems:"center"
  },
  BurgerIcon:{
    marginRight:"1rem"
  }
}
 
/* export async function getServerSideProps(context) {
  const dd = await axios.get('http://localhost:3000/api/products');

  console.log(dd)
  return{
    props:{
      dd,
      text:"good"
    }
  }
} */

export default ProductsTable 