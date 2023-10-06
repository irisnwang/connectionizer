import { Alert, Box, Button, Dialog, Grid, Typography } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { findPuzzleById } from "../services/puzzles-service";

const difficultyColor = (difficulty) => {
  return {
    1: "yellow",
    2: "green",
    3: "blue",
    4: "purple",
  }[difficulty];
};

const difficultyEmoji = (difficulty) => {
  return {
    1: "🟨",
    2: "🟩",
    3: "🟦",
    4: "🟪",
  }[difficulty];
};

const setEquals = (setA, setB) => {
  console.log(setA);
  console.log(setB);
  if (setA.length !== setB.length) {
    return false;
  }

  return [...setA].every((item) => setB.includes(item));
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

export const Game = () => {
  const { id } = useParams();
  const [gameData, setGameData] = useState({});
  const [activeItems, setActiveItems] = useState([]);
  const [complete, setComplete] = useState([]);
  const [incomplete, setIncomplete] = useState([]);
  const [mistakesRemaining, setMistakesRemaining] = useState(-1);
  const [winState, setWinState] = useState("playing");
  const [pastGuesses, setPastGuesses] = useState([]);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const guessed = (currentGuess) => {
    for (const pastGuess of pastGuesses) {
      if (setEquals(currentGuess, pastGuess)) {
        return true;
      }
    }
    return false;
  };

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

    if (guessed(activeItems)) {
      return;
    }

    let goodGuess = true;

    const [category, difficulty] = [
      activeItems[0].category,
      activeItems[0].difficulty,
    ];

    for (let i = 1; i < 4; i++) {
      goodGuess =
        goodGuess &&
        activeItems[i].difficulty === difficulty &&
        activeItems[i].category === category;
    }

    setPastGuesses([...pastGuesses, activeItems]);
    setActiveItems([]);

    if (!goodGuess) {
      setMistakesRemaining(mistakesRemaining - 1);
      if (mistakesRemaining === 1) {
        setWinState("lose");
      }
      return;
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
        category: category,
        difficulty: difficulty,
        text: activeItems.map((item) => item.word).join(", "),
      },
    ]);

    if (complete.length === 3) {
      alert("happy happy happy");
      setWinState("win");
    }
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
    const finalGuessString = pastGuesses
      .map((guess) =>
        guess.map((word) => difficultyEmoji(word.difficulty)).join(" ")
      )
      .join("\n");

    return (
      <Box align="center" justify="center" margin="10px">
        <Typography sx={{ whiteSpace: "break-spaces" }}>
          {finalGuessString}
        </Typography>
        <Button
          variant="filled"
          rounded="full"
          onClick={() => {
            setCopied(true);
            navigator.clipboard.writeText(finalGuessString);
          }}
        >
          Copy Results
        </Button>
        {copied && <Alert severity="success">Results copied!</Alert>}
      </Box>
    );
  };

  if (gameData === "NO GAME") {
    return (
      <Box h="100vh" w="100vw" align="center" justify="center">
        404
      </Box>
    );
  }

  return (
    <>
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
                  minHeight: "80px",
                }}
                color={difficultyColor(group.difficulty)}
                variant="contained"
              >
                <Box align="center" justify="center" margin="10px">
                  <Typography fontWeight='bold' color={"black"}>{group.category}</Typography>
                  <Typography color={"black"}>{group.text}</Typography>
                </Box>
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
              onClick={() => setOpen(true)}
              sx={{ margin: 4 }}
            >
              View Results
            </Button>
          )}
        </Grid>
      </Box>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setCopied(false);
        }}
      >
        {showResults()}
      </Dialog>
    </>
  );
};

export default Game;
