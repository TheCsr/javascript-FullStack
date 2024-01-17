import { useEffect, useState } from 'react';
import { Beer } from '../../types';
import { fetchData } from './utils';
import { Avatar, List, ListItemAvatar, ListItemButton, ListItemText, Pagination, TextField } from '@mui/material';
import SportsBar from '@mui/icons-material/SportsBar';
import { useNavigate } from 'react-router-dom';

const BeerList = () => {
  const navigate = useNavigate();
  const [beerList, setBeerList] = useState<Array<Beer>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;
  const [query, setQuery] = useState<string>("");
  const [sort, setSort] = useState<string>("asc");

  // eslint-disable-next-line
  useEffect(fetchData.bind(this, setBeerList, { page: currentPage, per_page: perPage }), [currentPage]);

  const onBeerClick = (id: string) => navigate(`/beer/${id}`);
  console.log("currentPage", currentPage);
  console.log("Beer list", beerList);

  return (
    <article>
      <section>
        <header>
          <h1>BeerList page</h1>
        </header>
        <main>
          <TextField
            label="Filter..."
            variant="outlined"
            // value={filterTerm}
            // onChange={(e) => setFilterTerm(e.target.value)}
          />
          <List>
            {beerList.map((beer) => (
              <ListItemButton key={beer.id} onClick={onBeerClick.bind(this, beer.id)}>
                <ListItemAvatar>
                  <Avatar>
                    <SportsBar />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={beer.name} secondary={beer.brewery_type} />
              </ListItemButton>
            ))}
          </List>
          <Pagination
            count={20}
            page={currentPage}
            onChange={(e, value) => setCurrentPage(value)}
            color="primary"
          />
        </main>
      </section>
    </article>
  );
};

export default BeerList;
