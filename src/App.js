import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const CLIENT_ID = '039d5821559b4a5d9b1bf28c3f5f0087'
const CLIENT_SECRET = '61452e8abdf945e1a7f60f5afa209e2c'

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAblums] = useState([]);

  useEffect(() => {
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
  }, [])
  
  async function search() {
    console.log("Search for " + searchInput)
    var searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }
    var artistId = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
      .then(response => response.json())
      .then(data => { return data.artists.items[0].id })
    console.log('Artist id: ' + artistId)

    var albums = await fetch('https://api.spotify.com/v1/artists/' + artistId + '/albums' + '?include_groups=album&market=US&limit=50', searchParameters)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setAblums(data.items);
    })
  }

  console.log(albums)
  return (
    <div className="App">
      <Container>
        <InputGroup className='mb-3' size="lg">
          <FormControl
            placeholder='type artist name'
            type="input"
            onChange={(e)=>setSearchInput(e.target.value)}
          />
          <Button onClick={search}>
            Search
        </Button>
        </InputGroup>
      </Container>
      <Container>
        <Row className="mx-2 row row-cols-4">
          {albums.map((album, i) => {
            return (
              <Card>
                  <a href={album.external_urls.spotify} target="_blank">
                  <Card.Img src={album.images[0].url} />
                  </a>
                  <Card.Body>
                    <Card.Title>{album.name}</Card.Title>
                  </Card.Body>
                </Card>
            )
          })}
        </Row>
      </Container>
    </div>
  );
}

export default App;
