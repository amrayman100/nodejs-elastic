import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import "../App.css";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    margin: 30,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const ElasticSearch = (props) => {
  const [data, setData] = useState([]);
  const [searchInput, setSearchInput] = useState([]);
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  async function getData(url) {
    const response = await fetch(url);
    const data = await response.json();
  }

  useEffect(() => {}, []);

  async function handleInputChange(event) {
    setSearchInput(event.target.value);
    console.log(searchInput);
    const response = await fetch(`/productsSearch?q=${searchInput}`);
    const data = await response.json();
    setData(data);
    console.log(data);
  }

  let products = data.map((product, index) => (
    <Card className={classes.root} variant="outlined" key={index}>
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          {product._source.name}
        </Typography>

        <Typography className={classes.pos} color="textSecondary">
          Price: {product._source.price}
        </Typography>
        <Typography variant="body2" component="p">
          In Stock: {product._source.in_stock}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  ));

  return (
    <div>
      <div className="searchField">
        <TextField
          id="standard-search"
          label="Search field"
          type="search"
          onChange={handleInputChange}
        />
      </div>

      <div className="cardDiv">{products}</div>
    </div>
  );
};

export default ElasticSearch;
