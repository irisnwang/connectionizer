import { Box, Button, Grid, Typography } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { findPuzzleById } from "../services/puzzles-service";

const difficultyColor = (difficulty) => {
  return {
    1: "info",
    2: "error",
    3: "warning",
    4: "success",
  }[difficulty];
};

const chunk = (list, size) => {
  const chunkCount = Math.ceil(list.length / size);
  return new Array(chunkCount).fill(null).map((_c, i) => {
    return list.slice(i * size, i * size + size);
  });
};

const shuffleUtil = (list) => {
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
  const [complete, setComplete] = useState([]);
  const [incomplete, setIncomplete] = useState([]);
  const [mistakesRemaining, setMistakesRemaining] = useState(-1);
  const [winState, setWinState] = useState("playing");
  const [pastGuesses, setPastGuesses] = useState([]);

  const getGame = async () => {
    const game = await findPuzzleById(id);
    if (Object.keys(game).length === 0) {
      setGameData("NO GAME");
      return;
    }
    setGameData(game);
    setIncomplete(shuffleUtil([...game.words]));
    setMistakesRemaining(parseInt(game.guesses));
  };

  const submit = () => {
    if (activeItems.length !== 4) {
      throw new Error("THIS SHOULD NEVER HAPPEN!");
    }

    const [cat, difficulty] = [
      activeItems[0].category,
      activeItems[0].difficulty,
    ];

    for (let i = 1; i < 4; i++) {
      if (
        activeItems[i].difficulty !== difficulty ||
        activeItems[i].category !== cat
      ) {
        alert("NO!!!");
        setMistakesRemaining(mistakesRemaining - 1);
        if (mistakesRemaining === 1) {
          alert("wompwomp");
          setWinState("lose");
        }
        return;
      }
    }

    setIncomplete(
      incomplete.filter(
        (incompleteItem) =>
          incompleteItem !== activeItems[0] &&
          incompleteItem !== activeItems[1] &&
          incompleteItem !== activeItems[2] &&
          incompleteItem !== activeItems[3]
      )
    );

    setComplete([
      ...complete,
      {
        category: cat,
        difficulty,
        text: activeItems.map((item) => item.word).join(", "),
      },
    ]);

    if (complete.length === 3) {
      alert("happy happy happy");
      setWinState("win");
    }

    setActiveItems([]);
  };

  const shuffle = () => {
    setIncomplete(shuffleUtil([...incomplete]));
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

  const showResults = () => {
    alert("TODO")
  }

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
          <Grid container gap={2} justifyContent="center">
            {complete.map((group) => (
              <Button
                disabled
                style={{
                  minWidth: "650px",
                  // maxWidth: "600px",
                  minHeight: "80px",
                }}
                color={difficultyColor(group.difficulty)}
                variant="contained"
              >
                <Typography color={"black"}>{group.text}</Typography>
              </Button>
            ))}

            {chunk(incomplete, 4).map((row) => (
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
                      onClick={() => select(item)}
                    >
                      <Typography
                        color={activeItems.includes(item) ? "white" : "black"}
                      >
                        {item.word}
                      </Typography>
                    </Button>
                  ))}
                </Grid>
              </>
            ))}
          </Grid>

          {winState === "playing" ? (
            <>
              <Grid align="baseline">
                <Typography>Mistakes remaining:</Typography>
                {mistakesRemaining >= 0
                  ? [...Array(mistakesRemaining).keys()].map(() => (
                      <CircleIcon bg="gray.800" size="12px" />
                    ))
                  : "Infinite"}
              </Grid>
              <Grid>
                <Button variant="outline" rounded="full" onClick={shuffle}>
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
                  onClick={submit}
                >
                  Submit
                </Button>
              </Grid>
            </>
          ) : (
            <Button
              variant="outline"
              rounded="full"
              onClick={showResults}
              sx={{margin: 4}}
            >
              View Results
            </Button>
          )}
        </Grid>
      </Box>
    </>
  );
};

export default Game;
