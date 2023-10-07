import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { createPuzzle } from "../services/puzzles-service";
import { BASE_URL } from "./utils";

export const Creator = () => {
  const form = useForm();

  const infiniteGuesses = form.watch("infinite");
  form.watch("guesses");

  const onSubmit = async (data) => {
    const created = await createPuzzle({
      author: data.author,
      title: data.title,
      guesses: data.guesses,
      categories: [
        {
          category: data.category1,
          difficulty: 1,
          words: [
            data.cat1word1,
            data.cat1word2,
            data.cat1word3,
            data.cat1word4,
          ],
        },
        {
          category: data.category2,
          difficulty: 2,
          words: [
            data.cat2word1,
            data.cat2word2,
            data.cat2word3,
            data.cat2word4,
          ],
        },
        {
          category: data.category3,
          difficulty: 3,
          words: [
            data.cat3word1,
            data.cat3word2,
            data.cat3word3,
            data.cat3word4,
          ],
        },
        {
          category: data.category4,
          difficulty: 4,
          words: [
            data.cat4word1,
            data.cat4word2,
            data.cat4word3,
            data.cat4word4,
          ],
        },
      ],
    });
    window.location.replace(BASE_URL + "create/" + created._id);
  };

  function CategoryRow(number) {
    return (
      <Box display="grid" gridTemplateColumns="1fr 1fr 1fr 1fr" gap={2}>
        <Box gridColumn="span 4">
          <Controller
            rules={{ required: true }}
            key={number}
            name={"category" + number}
            control={form.control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                helperText={error ? error.message : null}
                size="small"
                fullWidth
                error={!!error}
                onChange={onChange}
                value={value}
                label={"Category " + number}
                variant="outlined"
              />
            )}
          />
        </Box>
        <>
          {Array.from({ length: 4 }, (_, i) => i + 1).map((n) => {
            return (
              <Controller
                rules={{ required: true }}
                name={"cat" + number + "word" + n}
                key={number + " " + n}
                control={form.control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    key={number + " " + n}
                    helperText={error ? error.message : null}
                    size="small"
                    error={!!error}
                    onChange={onChange}
                    value={value}
                    variant="outlined"
                  />
                )}
              />
            );
          })}
        </>
      </Box>
    );
  }

  return (
    <Box
      display="grid"
      alignItems="center"
      justifyItems="center"
      justifyContent="space-between"
      gap={2}
      gridTemplateColumns="1fr"
    >
      <Typography fontSize="24px" className="container">
        Create a Puzzle
      </Typography>
      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
        <Controller
          name="author"
          control={form.control}
          render={({ field: { onChange, value } }) => (
            <TextField
              size="small"
              fullWidth
              onChange={onChange}
              value={value}
              label={"Author (Optional)"}
              variant="outlined"
            />
          )}
        />
        <Controller
          rules={{ required: true }}
          name="title"
          control={form.control}
          render={({ field: { onChange, value } }) => (
            <TextField
              size="small"
              fullWidth
              onChange={onChange}
              value={value}
              label="Title (Optional)"
              variant="outlined"
            />
          )}
        />
      </Box>
      {Array.from({ length: 4 }, (_, i) => i + 1).map((n) => CategoryRow(n))}
      <Box display="grid">
        <Controller
          rules={{ required: true }}
          name={"guesses"}
          control={form.control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              helperText={error ? error.message : null}
              disabled={infiniteGuesses}
              type="number"
              size="small"
              error={!!error}
              value={field.value >= 0 ? field.value : ""}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              label={"Guesses"}
              variant="outlined"
              InputProps={{
                inputProps: {
                  min: 0,
                },
              }}
            />
          )}
        />
        <FormControlLabel
          control={
            <Controller
              name={"infinite"}
              control={form.control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  checked={field.value ?? false}
                  onChange={(e) => {
                    if (e.target.checked) {
                      form.setValue("guesses", -1);
                    } else {
                      form.setValue("guesses", null);
                    }
                    field.onChange(e.target.checked);
                  }}
                />
              )}
            />
          }
          label="Infinite Guesses"
          labelPlacement="end"
        />
      </Box>
      <Button onClick={form.handleSubmit(onSubmit)} variant="outlined">
        Share
      </Button>
    </Box>
  );
};

export default Creator;
