import { Box, Button, Grid, Typography } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import data from '../test/res/examples.json'

const DAY_1 = [
    {
        category: 'Timekeeping devices',
        items: ['Clock', 'Hourglass', 'Sundial', 'Watch'],
    },
    {
        category: 'Units of measure',
        items: ['Second', 'Newton', 'Hertz', 'Mole'],
    },
    {
        category: 'Hairstyles',
        items: ['Bob', 'Crop', 'Pixie', 'Shag'],
    },
    {
        category: 'Dr. ___',
        items: ['Evil', 'PPP', 'J', 'No'],
    },
];

const difficultyColor = (difficulty) => {
    return {
        1: '#fbd400',
        2: '#b5e352',
        3: '#729eeb',
        4: '#bc70c4',
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

const methods = (state) => {
    return {
        toggleActive(item) {
            if (state.activeItems.includes(item)) {
                state.activeItems = state.activeItems.filter((i) => i !== item);
            } else if (state.activeItems.length < 4) {
                state.activeItems.push(item);
            }
        },

        shuffle() {
            shuffle(state.items);
        },

        deselectAll() {
            state.activeItems = [];
        },

        submit() {
            const foundGroup = state.incomplete.find((group) =>
                group.items.every((item) => state.activeItems.includes(item)),
            );

            if (foundGroup) {
                state.complete.push(foundGroup);
                const incomplete = state.incomplete.filter((group) => group !== foundGroup);
                state.incomplete = incomplete;
                state.items = shuffle(incomplete.flatMap((group) => group.items));
                state.activeItems = [];
            } else {
                state.mistakesRemaining -= 1;
                state.activeItems = [];

                if (state.mistakesRemaining === 0) {
                    state.complete = [...state.incomplete];
                    state.incomplete = [];
                    state.items = [];
                }
            }
        },
    };
};

export const Game = () => {
    const useGame = (options) => {
        const initialState = {
            // gray tiles with extra info
            incomplete: options.groups,
            // color tiles
            complete: [],
            // strings of unselected
            items: shuffle(options.groups.flatMap((g) => g.items)),
            // strings of selected
            activeItems: [],
            mistakesRemaining: options.json.guesses,
        };

        return {
            ...initialState,
            ...methods,
        };
    };

    const game = useGame({
        json: data.example1,
        groups: DAY_1,
    });

    return (
        <>

            <Button>
                Share
            </Button>
            <Box h="100vh" w="100vw" align="center" justify="center">
                <Grid spacing={4} align="center">
                    <Typography size="3xl" fontFamily="Georgia" fontWeight="light">
                        Connections
                    </Typography>
                    <Typography fontWeight="semibold">Create four groups of four!</Typography>
                    <Grid>
                        {game.complete.map((group) => (
                            <Grid
                                spacing={1}
                                lineHeight={1}
                                rounded="lg"
                                align="center"
                                justify="center"
                                minHeight="80px"
                                minWidth="624px"
                                bg={difficultyColor(group.difficulty)}
                            >
                                <Typography fontSize="xl" fontWeight="extrabold" textTransform="uppercase">
                                    {group.category}
                                </Typography>
                                <Typography fontSize="xl" textTransform="uppercase">
                                    {group.items.join(', ')}
                                </Typography>
                            </Grid>
                        ))}

                        {chunk(game.items, 4).map((row) => (
                            <>
                                <Grid>
                                    {row.map((item) => (
                                        <Button style={{
                                            minWidth: "150px",
                                            maxWidth: "150px",
                                            minHeight: "80px"
                                        }}

                                        // bg="#efefe6"
                                        // fontSize="16px"
                                        // fontWeight="extrabold"
                                        // textTransform="uppercase"
                                        // onClick={() => game.toggleActive(item)}
                                        // isActive={game.activeItems.includes(item)}
                                        // _active={{
                                        //     bg: '#5a594e',
                                        //     color: 'white',
                                        // }}
                                        >
                                            <Typography noWrap>
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
                        {
                            game.mistakesRemaining >= 0 ?
                                [...Array(game.mistakesRemaining).keys()].map(() => (
                                    <CircleIcon bg="gray.800" size="12px" />
                                )) : "Infinite"
                        }
                    </Grid>
                    <Grid>
                        <Button
                            colorScheme="black"
                            variant="outline"
                            rounded="full"
                            borderWidth="2px"
                            onClick={game.shuffle}
                        >
                            Shuffle
                        </Button>
                        <Button
                            colorScheme="black"
                            variant="outline"
                            rounded="full"
                            borderWidth="2px"
                            onClick={game.deselectAll}
                        >
                            Deselect All
                        </Button>
                        <Button
                            colorScheme="black"
                            variant="outline"
                            rounded="full"
                            borderWidth="2px"
                            isDisabled={game.activeItems.length !== 4}
                            onClick={game.submit}
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}

export default Game;
