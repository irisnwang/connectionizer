import {
    Button,
    ChakraProvider,
    Circle,
    Flex,
    HStack,
    Heading,
    Stack,
    Text,
    Menu,
    MenuButton,
} from '@chakra-ui/react';
import useMethods from 'use-methods';

const DAY_1 = [
    {
        category: 'Timekeeping devices',
        items: ['Clock', 'Hourglass', 'Sundial', 'Watch'],
        difficulty: 1,
    },
    {
        category: 'Units of measure',
        items: ['Second', 'Newton', 'Hertz', 'Mole'],
        difficulty: 2,
    },
    {
        category: 'Hairstyles',
        items: ['Bob', 'Crop', 'Pixie', 'Shag'],
        difficulty: 3,
    },
    {
        category: 'Dr. ___',
        items: ['Evil', 'Pepper', 'J', 'No'],
        difficulty: 4,
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
            mistakesRemaining: 4,
        };

        const [state, fns] = useMethods(methods, initialState);

        return {
            ...state,
            ...fns,
        };
    };

    const game = useGame({
        groups: DAY_1,
    });

    return (
        <ChakraProvider>
            <Menu>
                <MenuButton m={[2, 3]} as={Button}>
                    Share
                </MenuButton>
            </Menu>
            <Flex h="100vh" w="100vw" align="center" justify="center">
                <Stack spacing={4} align="center">
                    <Heading size="3xl" fontFamily="Georgia" fontWeight="light">
                        Connections
                    </Heading>
                    <Text fontWeight="semibold">Create four groups of four!</Text>
                    <Stack>
                        {game.complete.map((group) => (
                            <Stack
                                spacing={1}
                                lineHeight={1}
                                rounded="lg"
                                align="center"
                                justify="center"
                                h="80px"
                                w="624px"
                                bg={difficultyColor(group.difficulty)}
                            >
                                <Text fontSize="xl" fontWeight="extrabold" textTransform="uppercase">
                                    {group.category}
                                </Text>
                                <Text fontSize="xl" textTransform="uppercase">
                                    {group.items.join(', ')}
                                </Text>
                            </Stack>
                        ))}

                        {chunk(game.items, 4).map((row) => (
                            <>
                                <HStack>
                                    {row.map((item) => (
                                        <Button
                                            w="150px"
                                            h="80px"
                                            bg="#efefe6"
                                            fontSize="16px"
                                            fontWeight="extrabold"
                                            textTransform="uppercase"
                                            onClick={() => game.toggleActive(item)}
                                            isActive={game.activeItems.includes(item)}
                                            _active={{
                                                bg: '#5a594e',
                                                color: 'white',
                                            }}
                                        >
                                            {item}
                                        </Button>
                                    ))}
                                </HStack>
                            </>
                        ))}
                    </Stack>
                    <HStack align="baseline">
                        <Text>Mistakes remaining:</Text>
                        {[...Array(game.mistakesRemaining).keys()].map(() => (
                            <Circle bg="gray.800" size="12px" />
                        ))}
                    </HStack>
                    <HStack>
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
                    </HStack>
                </Stack>
            </Flex>
        </ChakraProvider>
    );
}

export default Game;
