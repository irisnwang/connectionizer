import { Box, Button, Grid, Typography } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { findPuzzleById } from "../services/puzzles-service";

const difficultyColor = (difficulty) => {
  return {
    1: "#fbd400",
    2: "#b5e352",
    3: "#729eeb",
    4: "#bc70c4",
  }[difficulty];
};

const chunk = (list, size) => {
  const chunkCount = Math.ceil(list.length / size);
  return new Array(chunkCount).fill(null).map((_c, i) => {
    return list.slice(i * size, i * size + size);
  });
};

const shuffle = (list) => {
  return list.sort(() => 0.5 - Math.random());
};

// const methods = (state) => {
//   return {
//     toggleActive(item) {
//       if (state.activeItems.includes(item)) {
//         state.activeItems = state.activeItems.filter((i) => i !== item);
//       } else if (state.activeItems.length < 4) {
//         state.activeItems.push(item);
//       }
//     },

//     shuffle() {
//       shuffle(state.items);
//     },

//     deselectAll() {
//       state.activeItems = [];
//     },

//     submit() {
//       const foundGroup = state.incomplete.find((group) =>
//         group.items.every((item) => state.activeItems.includes(item))
//       );

//       if (foundGroup) {
//         state.complete.push(foundGroup);
//         const incomplete = state.incomplete.filter(
//           (group) => group !== foundGroup
//         );
//         state.incomplete = incomplete;
//         state.items = shuffle(incomplete.flatMap((group) => group.items));
//         state.activeItems = [];
//       } else {
//         state.mistakesRemaining -= 1;
//         state.activeItems = [];

//         if (state.mistakesRemaining === 0) {
//           state.complete = [...state.incomplete];
//           state.incomplete = [];
//           state.items = [];
//         }
//       }
//     },
//   };
// };

export const Game = () => {
  const { id } = useParams();
  const [gameData, setGameData] = useState({});
  const [activeItems, setActiveItems] = useState([]);
  const [incomplete, setIncomplete] = useState(gameData.words);
  const [items, setItems] = useState([]);
  const [mistakesRemaining, setMistakesRemaining] = useState(-1);

  const getGame = async () => {
    const game = await findPuzzleById(id);
    if (Object.keys(game).length === 0) {
      setGameData("NO GAME");
      return;
    }
    setGameData(game);
    setItems(shuffle([...game.words]));
    setMistakesRemaining(parseInt(game.guesses));
  };

  const game = {
    // color tiles
    complete: [],
  };

  useEffect(() => {
    getGame();
  }, []);

  const select = (item) => {
    if (activeItems.includes(item)) {
      setActiveItems(activeItems.filter((i) => i !== item));
    } else if (activeItems.length < 4) {
      setActiveItems([...activeItems, item]);
    }
  };

  return gameData === "NO GAME" ? (
    <Box h="100vh" w="100vw" align="center" justify="center">
      404
    </Box>
  ) : (
    <>
      <Button>Share {id}</Button>
      <Box h="100vh" w="100vw" align="center" justify="center">
        <Grid align="center">
          <Typography size="3xl" fontFamily="Georgia" fontWeight="light">
            Connections
          </Typography>
          <Typography fontWeight="semibold">
            Create four groups of four!
          </Typography>
          <Grid container gap={2} py={3}>
            {game.complete.map((group) => (
              <Grid
                container
                spacing={1}
                lineHeight={1}
                rounded="lg"
                align="center"
                justify="center"
                minHeight="80px"
                minWidth="624px"
                bg={difficultyColor(group.difficulty)}
              >
                <Typography
                  fontSize="xl"
                  fontWeight="extrabold"
                  textTransform="uppercase"
                >
                  {group.category}
                </Typography>
                <Typography fontSize="xl" textTransform="uppercase">
                  {group.items.join(", ")}
                </Typography>
              </Grid>
            ))}

            {chunk(
              items.flatMap((g) => g.word),
              4
            ).map((row) => (
              <>
                <Grid container gap={2} justifyContent="center">
                  {row.map((item) => (
                    <Button
                      style={{
                        minWidth: "150px",
                        maxWidth: "150px",
                        minHeight: "80px",
                      }}
                      color={
                        activeItems.includes(item) ? "secondary" : "primary"
                      }
                      variant="contained"
                      // bg="#efefe6"
                      // fontSize="16px"
                      // fontWeight="extrabold"
                      // textTransform="uppercase"
                      onClick={() => select(item)}
                      // _active={{
                      //     bg: '#5a594e',
                      //     color: 'white',
                      // }}
                    >
                      <Typography
                        color={activeItems.includes(item) ? "white" : "black"}
                      >
                        {item}
                      </Typography>
                    </Button>
                  ))}
                </Grid>
              </>
            ))}
          </Grid>
          <Grid align="baseline">
            <Typography>Mistakes remaining:</Typography>
            {mistakesRemaining >= 0
              ? [...Array(mistakesRemaining).keys()].map(() => (
                  <CircleIcon bg="gray.800" size="12px" />
                ))
              : "Infinite"}
          </Grid>
          <Grid>
            <Button variant="outline" rounded="full" onClick={game.shuffle}>
              Shuffle
            </Button>
            <Button
              variant="outline"
              rounded="full"
              onClick={() => setActiveItems([])}
            >
              Deselect All
            </Button>
            <Button
              variant="outline"
              rounded="full"
              disabled={activeItems.length !== 4}
              onClick={game.submit}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Game;
