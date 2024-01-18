import { useEffect, useState } from "react";
import { fetchData } from "./utils";
import { Beer } from "../../types";
import { Link as RouterLink } from "react-router-dom";
import {
  Button,
  Checkbox,
  Paper,
  TextField,
  Link,
  Avatar,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  ListItem,
} from "@mui/material";
import SportsBar from "@mui/icons-material/SportsBar";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [beerList, setBeerList] = useState<Array<Beer>>([]);
  const [filterTerm, setFilterTerm] = useState<string>("");
  const [savedList, setSavedList] = useState<Array<Beer>>([]);
  const [selected, setSelected] = useState<string[]>([]);
  // eslint-disable-next-line
  useEffect(fetchData.bind(this, setBeerList), []);

  const handlefetchBeer = () => {
    fetchData(setBeerList);
  };

  console.log("selected", selected);

  const handleCheckboxChange = (beerId: string) => {
    const isSelected = selected.includes(beerId);
    if (isSelected) {
      const selectedIds = selected.filter((id) => id !== beerId);
      localStorage.setItem("selected", JSON.stringify(selectedIds));
      setSelected(selectedIds);
      const removeFromSavedList = savedList.filter(
        (beer) => beer.id !== beerId
      );
      localStorage.setItem("savedList", JSON.stringify(removeFromSavedList));
      setSavedList(removeFromSavedList);
    } else {
      const selectedIds = [...selected, beerId];
      localStorage.setItem("selected", JSON.stringify(selectedIds));
      setSelected(selectedIds);
      const newObject: Beer | undefined = beerList.find(
        (obj) => obj.id === beerId
      );
      if (newObject) {
        // Add the new Beer object to savedList
        const addToSavedList: Beer[] = [...savedList, newObject];
        localStorage.setItem("savedList", JSON.stringify(addToSavedList));
        setSavedList(addToSavedList);
      }
    }
  };

  // Filter the beer list based on the input filter term
  const filteredBeerList = beerList.filter((beer) =>
    beer.name.toLowerCase().includes(filterTerm.toLowerCase())
  );

  const handleRemoveList = () => {
    setSavedList([]);
    setSelected([]);
    localStorage.removeItem("savedList");
    localStorage.removeItem("selected");
  };

  const onBeerClick = (id: string) => navigate(`/beer/${id}`);

  useEffect(() => {
    // Load favorite list from local storage
    const storedDataArray = localStorage.getItem("savedList");
    const storedSelectedIds = localStorage.getItem("selected");
    if (storedDataArray) {
      let storedSavedList: Beer[] = JSON.parse(storedDataArray) || [];
      setSavedList(storedSavedList);
    }
    if (storedSelectedIds) {
      let storedSelectedList = JSON.parse(storedSelectedIds) || [];
      setSelected(storedSelectedList);
    }
  }, []);

  return (
    <article>
      <section>
        <main>
          <Paper>
            <div className={styles.listContainer}>
              <div className={styles.listHeader}>
                <TextField
                  label="Filter..."
                  variant="outlined"
                  value={filterTerm}
                  onChange={(e) => setFilterTerm(e.target.value)}
                />
                <div>
                  <Button variant="contained" onClick={handlefetchBeer}>
                    Reload list
                  </Button>
                </div>
              </div>
              <List>
                {filteredBeerList.map((beer, index) => (
                  <ListItem
                    key={beer.id}
                    secondaryAction={
                      selected.includes(beer.id) ? (
                        <FavoriteIcon
                          color="action"
                          onClick={() => handleCheckboxChange(beer.id)}
                        />
                      ) : (
                        <FavoriteBorderIcon
                          onClick={() => handleCheckboxChange(beer.id)}
                        />
                      )
                    }
                  >
                    <ListItemButton onClick={onBeerClick.bind(this, beer.id)}>
                      <ListItemAvatar>
                        <Avatar>
                          <SportsBar />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={beer.name}
                        secondary={beer.brewery_type}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </div>
          </Paper>

          <Paper>
            <div className={styles.listContainer}>
              <div className={styles.listHeader}>
                <h3>Saved items</h3>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleRemoveList}
                >
                  Remove all items
                </Button>
              </div>
              <List>
                {savedList.map((beer, index) => (
                  <ListItemButton
                    key={index.toString()}
                    onClick={onBeerClick.bind(this, beer.id)}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <SportsBar />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={beer.name}
                      secondary={beer.brewery_type}
                    />
                  </ListItemButton>
                ))}
              </List>
            </div>
          </Paper>
        </main>
      </section>
    </article>
  );
};

export default Home;
