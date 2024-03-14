import { Alert, Box, Button, Dialog, Grid, Typography } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { findPuzzleById } from "../services/puzzles-service";

// Util methods
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

const getFontSize = (text, max) => {
  if (text.length > max) {
    return "12px";
  }
  return "16px";
};

const setEquals = (setA, setB) => {
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
  // Game hooks
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
  const [message, setMessage] = useState(null);
  const [shareMessage, setShareMessage] = useState(null);

  // Init
  const getGame = async () => {
    const game = await findPuzzleById(id);
    if (Object.keys(game).length === 0) {
      setGameData("NO GAME");
      return;
    }
    setGameData(game);
    const words = game.categories.flatMap((category) => {
      return category.words.map((word) => ({
        word: word,
        difficulty: category.difficulty,
      }));
    });
    setIncomplete(shuffleUtil([...words]));
    setMistakesRemaining(parseInt(game.guesses));
  };

  useEffect(() => {
    getGame();
  }, []);

  // Game logic methods
  const shuffle = () => {
    setIncomplete(shuffleUtil([...incomplete]));
  };

  const select = (item) => {
    setMessage(null);
    if (activeItems.includes(item)) {
      setActiveItems(activeItems.filter((i) => i !== item));
    } else if (activeItems.length < 4) {
      setActiveItems([...activeItems, item]);
    }
  };

  const guessed = (currentGuess) => {
    for (const pastGuess of pastGuesses) {
      if (setEquals(currentGuess, pastGuess)) {
        return true;
      }
    }
    return false;
  };

  const submit = () => {
    // No op logic
    if (activeItems.length !== 4) {
      throw new Error("THIS SHOULD NEVER HAPPEN!");
    }
    if (guessed(activeItems)) {
      setMessage("Guessed already!");
      return;
    }

    // Guess check logic
    const guessMap = new Map();

    for (let i = 0; i < 4; i++) {
      const currentCount = guessMap.get(activeItems[i].difficulty);
      if (currentCount) {
        guessMap.set(activeItems[i].difficulty, currentCount + 1);
      } else {
        guessMap.set(activeItems[i].difficulty, 1);
      }
    }

    const goodGuess = guessMap.size === 1;
    const oneAway =
      guessMap.size === 2 && guessMap.values().next().value % 2 === 1;

    setPastGuesses([...pastGuesses, activeItems]);
    setActiveItems([]);

    // Incorrect
    if (!goodGuess) {
      setMistakesRemaining(mistakesRemaining - 1);
      if (mistakesRemaining === 1) {
        setShareMessage("I lost!");
        setMessage("You lose!");
        setWinState("lose");
        solveRemaining();
        return;
      }
      if (oneAway) {
        setMessage("One away!");
      } else {
        setMessage("Incorrect");
      }
      return;
    }

    // Correct
    setMessage(null);
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
      gameData.categories[activeItems[0].difficulty - 1],
    ]);

    // Check win condition
    if (complete.length === 3) {
      if (pastGuesses.length === 3) {
        setShareMessage("Perfect!");
      } else {
        setShareMessage("I won!");
      }
      setMessage("You win!");
      setWinState("win");
    }
  };

  const solveRemaining = () => {
    const newComplete = [];
    for (let i = 0; i < 4; i++) {
      if (!complete.some((item) => item.difficulty === i + 1)) {
        newComplete.push(gameData.categories[i]);
      }
    }

    setComplete([...complete, ...newComplete]);

    setIncomplete([]);
  };

  // Game render methods
  const showResults = () => {
    const titleString = gameData.title ?? "";
    const authorString = gameData.author ? " By " + gameData.author : "";

    const finalGuessString = pastGuesses
      .map((guess) =>
        guess.map((word) => difficultyEmoji(word.difficulty)).join(" ")
      )
      .join("\n");

    const finalShareMessage =
      titleString +
      authorString +
      "\n" +
      shareMessage +
      "\n" +
      finalGuessString +
      "\n" +
      window.location.href;

    return (
      <Box align="center" justify="center" margin="10px">
        <Typography sx={{ whiteSpace: "break-spaces" }}>
          {finalShareMessage}
        </Typography>
        <Button
          variant="filled"
          rounded="full"
          onClick={() => {
            setCopied(true);
            navigator.clipboard.writeText(finalShareMessage);
          }}
        >
          Copy Results
        </Button>
        {copied && <Alert severity="success">Results copied!</Alert>}
      </Box>
    );
  };

  const showAlert = () => {
    if (message) {
      return (
        <Alert severity="info" sx={{ maxWidth: "500px", marginBottom: "10px" }}>
          {message}
        </Alert>
      );
    }
    return <Box height="58px">&nbsp;</Box>;
  };

  // Game render
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
        {showAlert()}
        <Grid align="center">
          <Typography fontSize="24px">
            {gameData.title ?? "Connections"}
          </Typography>
          <Typography fontWeight="semibold" marginBottom="10px">
            {gameData.author
              ? "By " + gameData.author
              : "Create four groups of four!"}
          </Typography>
          <Box
            display="grid"
            gridTemplateColumns="1fr 1fr 1fr 1fr"
            gap={2}
            maxWidth="390px"
          >
            {complete.map((group) => (
              <Box gridColumn="span 4">
                <Button
                  disabled
                  style={{
                    minWidth: "390px",
                    maxWidth: "390px",
                    maxHeight: "80px",
                  }}
                  color={difficultyColor(group.difficulty)}
                  variant="contained"
                >
                  <Box align="center" justify="center" margin="10px">
                    <Typography
                      fontFamily="monospace"
                      fontWeight="bold"
                      color={"black"}
                    >
                      {group.category}
                    </Typography>
                    <Typography
                      noWrap
                      // fontSize={getFontSize(group.text, 40)}
                      fontFamily="monospace"
                      color={"black"}
                    >
                      {group.words.join(", ")}
                    </Typography>
                  </Box>
                </Button>
              </Box>
            ))}
            {chunk(incomplete, 4).map((row) => (
              <>
                {row.map((item) => (
                  <Button
                    style={{
                      maxWidth: "80px",
                      minHeight: "80px",
                    }}
                    color={activeItems.includes(item) ? "primary" : "secondary"}
                    variant="contained"
                    onClick={() => select(item)}
                  >
                    <Typography
                      fontFamily="monospace"
                      fontSize={getFontSize(item.word, 8)}
                      color={activeItems.includes(item) ? "white" : "black"}
                    >
                      {item.word}
                    </Typography>
                  </Button>
                ))}
              </>
            ))}
          </Box>

          {winState === "playing" ? (
            <>
              <Grid align="baseline">
                <Typography marginTop="10px">Mistakes remaining:</Typography>
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
